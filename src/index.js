import _Gcloud from 'gcloud';
import _Promise from 'bluebird';


export function getDataStore(options) {

    //options.keyFilename is required if you lack the GCE scope

    if (!options.projectId) {
        throw new Error('a google cloud projectId is required');
    }

    return _Gcloud.datastore.dataset(options);
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
 * Save multiple objects to datastore using the same method
 * @param {Object} datastore gcloud-node datastore object
 * @param {Object[]} entities in form [{key, data}, ..]
 * @param {string} method, one of: insert, update, upsert (default: insert)
 * @returns {Promise} resolving to apiResponse
 */
export function save_P(datastore, entities, method='insert') {
    return _Promise.promisify(datastore[method], datastore)(entities);
}

/**
 * Get multiple objects from datastore
 * @param {Object} datastore gcloud-node datastore object
 * @param {string|string[]} keys
 * @returns {Promise} resolving to apiResponse
 */
export function get_P(datastore, keys) {
    return _Promise.promisify(datastore.get, datastore)(keys);
}

/**
 * Delete multiple objects from datastore
 * @param {Object} datastore gcloud-node datastore object
 * @param {string|string[]} keys
 * @returns {Promise} resolving to apiResponse
 */
export function delete_P(datastore, keys) {
    return _Promise.promisify(datastore.delete, datastore)(keys);
}

/**
 * Create datastore query
 * @param {Object} datastore gcloud-node datastore object
 * @param {string} kind
 * @param {string} [namespace] optional namespace
 * @param {bool} [auto_paginate] set false to manually page through results (default: true)
 * @returns {Promise} resolving to apiResponse
 */
export function createQuery(datastore, kind, namespace = null, auto_paginate = true) {
    return datastore.createQuery(namespace, kind).autoPaginate(auto_paginate);
}

/**
 * Run datastore query
 */
export function runQuery(transaction, query, callback = null) {
    //callback = function(err, entities, nextQuery, apiResponse)
    return transaction.runQuery(query, callback);
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
