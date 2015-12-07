"use strict";

import _Assert from 'assert';
import _Fs from 'fs';

import _Ramda from 'ramda';

import * as _Oakds from '../src';


let valueEqual     = _Assert.deepStrictEqual;
let _auth_filename = process.env.GCLOUD_AUTH_FILE  || __dirname + '/auth-secret.json';
let _project_id    = process.env.GCLOUD_PROJECT_ID || read_project_id_from_file(__dirname + '/auth-project.json');
let _use_auth_file = _Fs.existsSync(_auth_filename);


function read_project_id_from_file(filename) {

    if (!_Fs.existsSync(filename)) {
        console.error('a project id is required');
        process.exit(99);
    }
    return _Fs.readFileSync(filename, {encoding: 'utf8'}).trim();
}

function get_init_options() {
    if (_use_auth_file) {
        return { projectId: _project_id, keyFilename: _auth_filename };
    }
    return { projectId: _project_id };
}

let datastore;
let namespace = 'oakdatastore_test';

describe('oakdatastore', function() {

    this.slow(3000);
    this.timeout(10000);

    before('#getDatastore()', () => {
        datastore = _Oakds.getDataStore(get_init_options());
    });

    afterEach('#deleteNamespace_P()', () => {
        return _Oakds.deleteNamespace_P(datastore, namespace);
    });

    describe('#createQuery()', () => {
        it('should return a query object', () => {
            let query = _Oakds.createQuery(datastore, 'kind');
            _Assert(query);
            let ns_query = _Oakds.createQuery(datastore, 'kind', namespace);
            _Assert(ns_query);
        });
    });

    describe('#makeKey()', () => {
        it('should throw an Error', () => {
            _Assert.throws(() => {_Oakds.makeKey(datastore, []);},
                            (err) => {return err.name === 'Error';});
        });

        it('should throw a custom error', () => {
            _Assert.throws(() => {_Oakds.makeKey(datastore, ['incomplete']);},
                            (err) => {return err.name === 'ArgumentError';});
        });

        it('should return a datastore key', () => {
            let key = _Oakds.makeKey(datastore, ['path', 'id']);
            _Assert(key);
        });

        it('should return a datastore key', () => {
            let key = _Oakds.makeKey(datastore, ['path', 'sub', 'id']);
            _Assert(key);
        });

        it('should return a namespaced datastore key', () => {
            let key = _Oakds.makeKey(datastore, ['path', 'id'], namespace);
            _Assert(key);
        });
    });

    describe('#save_P(), #get_P() and #delete_P()', () => {

        let key;

        before('makekey', () => {
            key  = _Oakds.makeKey(datastore, ['test_oakdatastore', 'id1'], namespace);
        });

        it('should save to datastore and read from datastore', async () => {

            let data = {testy: "This is setting testy"};

            await _Oakds.save_P(datastore, [{key, data}]);

            let result = await _Oakds.get_P(datastore, key);

            valueEqual(result.data, data);
            valueEqual(result.key, key);
        });
    });

    describe('#deleteNamespace_P()', function() {
        this.slow(6000);

        it('should delete a namespace from the datastore', async () => {

            let data1   = {testy1: "This is setting testy"};
            let key1    = _Oakds.makeKey(datastore, ['kind1', 'idA'], namespace);
            let entity1 = _Oakds.makeEntity(key1, data1);

            let data2   = {testy2: "This is setting testy"};
            let key2    = _Oakds.makeKey(datastore, ['kind2', 'idB'], namespace);
            let entity2 = _Oakds.makeEntity(key2, data2);

            await _Oakds.save_P(datastore, [entity1, entity2], 'upsert');

            await _Oakds.deleteNamespace_P(datastore, namespace);

            let should_be_empty = await _Oakds.get_P(datastore, [key1, key2]);
            valueEqual(should_be_empty, []);
        });
    });

    describe('#save_P(), #get_P() and #delete_P() multiple', () => {
        let first_key;
        let first_data;
        let second_keys = [];
        let second_keydata;
        let test_data = {testy: "This is setting testy"};

        before('makekey', () => {

            first_key  = _Oakds.makeKey(datastore, ['test_oakdatastore', 'id1'], namespace);
            first_data = _Oakds.makeEntity(first_key, test_data);

            second_keydata = _Ramda.range(0,10).map((i) => {
                let key = _Oakds.makeKey(datastore, ['test_oakdatastore', `id${i}`], namespace);
                second_keys.push(key);
                return _Oakds.makeEntity(key, test_data);
            });
        });

        afterEach('delete', async () => {
            await _Oakds.delete_P(datastore, first_key);
        });

        it('should fail to insert a set of keys because of a duplicate key', async (done) => {

            await _Oakds.save_P(datastore, [first_data]);

            _Oakds.save_P(datastore, second_keydata, 'insert')
            .then(() => {
                done(new Error('should have thrown an error when overwriting key'));
            })
            .catch((err) => {
                done();
            });
        });

        it('should upsert a set of keys despite a duplicate key ', async () => {

            await _Oakds.save_P(datastore, [first_data]);
            await _Oakds.save_P(datastore, second_keydata, 'upsert');

            let result1 = await _Oakds.get_P(datastore, first_key);
            let result2 = await _Oakds.get_P(datastore, second_keys);

            valueEqual(result1.data, test_data);
            valueEqual(result1.key, first_key);
            valueEqual(result2.length, 10);
        });
    });

});
