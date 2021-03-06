import _Gcloud from 'gcloud';
import _Promise from 'bluebird';
import _Ramda from 'ramda';

//kludge for async await errors
process.on('unhandledRejection', err => { throw err; });

/**
 * oakdatastore module.
 * @module oakdatastore
 */

/**
 * Make a datastore object from gcloud-node options
 * @param {Object} options gcloud-node options
 * @returns {Object} gcloud-node datastore object
 */
export function getDataStore(options) {

    //options.keyFilename is required if you lack the GCE scope

    if (!options.projectId) {
        throw new Error('a google cloud projectId is required');
    }

    return _Gcloud.datastore(options);
}

/**
 * Make a datastore key
 * @param {Object} datastore gcloud-node datastore object
 * @param {Array} path_list - the datastore path in array form: ['root', 'sub1', 'sub2', 'id']
 * @returns {Object} datastore key
 */
export function makeKey(datastore, path_list, namespace = null) {

    if (!path_list.length) {
        throw new Error('path list is required');
    }

    if (path_list.length < 2) {
        throw new ArgumentError("A path list of 1 item will create an incomplete key");
    }

    let key = path_list;

    if (namespace) {
        key = {namespace, path: path_list};
    }

    return datastore.key(key);
}

/**
 * Save multiple objects to datastore using the same method. nb if you "insert" 100 entities but 1 of them already exists, none of the entities will be written
 * @param {Object} datastore gcloud-node datastore object
 * @param {Object[]} entities in form [{key, data}, ..]
 * @param {string} method, one of: insert, update, upsert (default: insert)
 * @returns {Promise} resolving to apiResponse
 */
export function save_P(datastore, entities, method='insert') {
    return _Promise.promisify(datastore[method], {context: datastore})(entities);
}

/**
 * Get multiple objects from datastore
 * @param {Object} datastore gcloud-node datastore object
 * @param {string|string[]} keys
 * @returns {Promise} resolving to apiResponse
 */
export function get_P(datastore, keys) {
    return _Promise.promisify(datastore.get, {context: datastore})(keys);
}

/**
 * Delete multiple objects from datastore
 * @param {Object} datastore gcloud-node datastore object
 * @param {string|string[]} keys
 * @returns {Promise} resolving to apiResponse
 */
export function delete_P(datastore, keys) {
    return _Promise.promisify(datastore.delete, {context: datastore})(keys);
}

/**
 * deletes all entities in a namespace
 * @param {Object} datastore gcloud-node datastore object
 * @param {string} namespace to wipe
 * @returns {Promise} warning: this may take a long time to complete
 */
export function deleteNamespace_P(datastore, namespace) {

    if (!namespace || typeof(namespace) !== 'string') {
        throw new Error('namespace must be a nonempty string');
    }

    function deleteEntities_P(datastore, entities) {

        let keys = _Ramda.pluck('key')(entities);
        return delete_P(datastore, keys);
    }

    function kindWorker_P(datastore, entities) {

        let kinds = entities.map((entity) => {
            return entity.key.path[1];
        });

        return _Promise.resolve(kinds)
        .each((kind) => {

            // workaround to internals being returned
            // see https://stackoverflow.com/questions/34144414/how-to-query-all-namespaced-kinds-in-google-datastore-using-gcloud-node
            if (kind.indexOf('__') === 0) {
                return _Promise.resolve();
            }

            let query_kind = createQuery(datastore, kind, namespace, false);
            return workOnQuery_P(datastore, query_kind, deleteEntities_P);
        });
    }

    let query = createQuery(datastore, '__kind__', namespace, false);

    return workOnQuery_P(datastore, query, kindWorker_P);
}

/**
 * A helper function to process a query - warning: this may take a long time to complete
 * @param {Object} datastore gcloud-node datastore object
 * @param {Object} gcloud-node query object, as returned by createQuery()
 * @param {function} worker_P callback worker function which takes args: (datastore, entities) and must return a promise - will be called serially for larger datasets
 * @returns {Promise} resolving to the final apiResponse
 */
export function workOnQuery_P(datastore, query, worker_P) {

    function function_P(resolve, reject) {

        async function processResults(err, entities, nextQuery, apiResponse) {

            if (err) {
                return reject(err);
            }
            if (!entities.length) {
                return resolve(apiResponse);
            }

            await worker_P(datastore, entities);

            if (nextQuery) {
                return runQuery(datastore, nextQuery, processResults);
            }
            resolve(apiResponse);
        }

        runQuery(datastore, query, processResults);
    }
    return new _Promise(function_P);
}

/**
 * Create datastore query
 * @param {Object} datastore gcloud-node datastore object
 * @param {string} kind
 * @param {string} [namespace] optional namespace
 * @param {bool} [auto_paginate] set false to manually page through results (default: true)
 * @returns {Object} gcloud-node datastore/query object
 */
export function createQuery(datastore, kind, namespace = null, auto_paginate = true) {
    return datastore.createQuery(namespace, kind).autoPaginate(auto_paginate);
}

/**
 * Run gcloud-node datastore query, a functional-style helper
 * @param {Object} handle gcloud-node datastore or transaction object
 * @param {Object} query created by createQuery()
 * @param {function} [callback] optional callback to run with query results in form function(err, entities, nextQuery, apiResponse)
 */
export function runQuery(handle, query, callback = null) {
    return handle.runQuery(query, callback);
}

/**
 * Make entity helper
 * @param {Object} key gcloud-node datastore key
 * @param {Object} data to be stored in entity value
 * @returns {Object} entity
 */
export function makeEntity(key, data) {
    return {key, data};
}

// Error Helpers

function ArgumentError() {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'ArgumentError';
    this.stack = temp.stack;
    this.message = temp.message;
}
ArgumentError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: ArgumentError,
        writable: true,
        configurable: true
    }
});
