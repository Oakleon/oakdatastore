# oakdatastore

A partial [gcloud-node](https://github.com/GoogleCloudPlatform/gcloud-node) (google cloud) datastore wrapper with bluebird promises in functional style. Only does minimally what we need, no guarantees expressed or implied. Pull Requests for expanded functions/features are welcome.

See tests for usage.

Tested with node v4 LTS

## API Reference
oakdatastore module.


* [oakdatastore](#module_oakdatastore)
    * [~getDataStore(options)](#module_oakdatastore..getDataStore) ⇒ <code>Object</code>
    * [~makeKey(datastore, path_list)](#module_oakdatastore..makeKey) ⇒ <code>Object</code>
    * [~save_P(datastore, entities, method,)](#module_oakdatastore..save_P) ⇒ <code>Promise</code>
    * [~get_P(datastore, keys)](#module_oakdatastore..get_P) ⇒ <code>Promise</code>
    * [~delete_P(datastore, keys)](#module_oakdatastore..delete_P) ⇒ <code>Promise</code>
    * [~deleteNamespace_P(datastore, namespace)](#module_oakdatastore..deleteNamespace_P) ⇒ <code>Promise</code>
    * [~workOnQuery_P(datastore, gcloud-node, worker_P)](#module_oakdatastore..workOnQuery_P) ⇒ <code>Promise</code>
    * [~createQuery(datastore, kind, [namespace], [auto_paginate])](#module_oakdatastore..createQuery) ⇒ <code>Object</code>
    * [~runQuery(handle, query, [callback])](#module_oakdatastore..runQuery)
    * [~makeEntity(key, data)](#module_oakdatastore..makeEntity) ⇒ <code>Object</code>

<a name="module_oakdatastore..getDataStore"></a>
### oakdatastore~getDataStore(options) ⇒ <code>Object</code>
Make a datastore object from gcloud-node options

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Object</code> - gcloud-node datastore object  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | gcloud-node options |

<a name="module_oakdatastore..makeKey"></a>
### oakdatastore~makeKey(datastore, path_list) ⇒ <code>Object</code>
Make a datastore key

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Object</code> - datastore key  

| Param | Type | Description |
| --- | --- | --- |
| datastore | <code>Object</code> | gcloud-node datastore object |
| path_list | <code>Array</code> | the datastore path in array form: ['root', 'sub1', 'sub2', 'id'] |

<a name="module_oakdatastore..save_P"></a>
### oakdatastore~save_P(datastore, entities, method,) ⇒ <code>Promise</code>
Save multiple objects to datastore using the same method. nb if you "insert" 100 entities but 1 of them already exists, none of the entities will be written

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Promise</code> - resolving to apiResponse  

| Param | Type | Description |
| --- | --- | --- |
| datastore | <code>Object</code> | gcloud-node datastore object |
| entities | <code>Array.&lt;Object&gt;</code> | in form [{key, data}, ..] |
| method, | <code>string</code> | one of: insert, update, upsert (default: insert) |

<a name="module_oakdatastore..get_P"></a>
### oakdatastore~get_P(datastore, keys) ⇒ <code>Promise</code>
Get multiple objects from datastore

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Promise</code> - resolving to apiResponse  

| Param | Type | Description |
| --- | --- | --- |
| datastore | <code>Object</code> | gcloud-node datastore object |
| keys | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  |

<a name="module_oakdatastore..delete_P"></a>
### oakdatastore~delete_P(datastore, keys) ⇒ <code>Promise</code>
Delete multiple objects from datastore

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Promise</code> - resolving to apiResponse  

| Param | Type | Description |
| --- | --- | --- |
| datastore | <code>Object</code> | gcloud-node datastore object |
| keys | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> |  |

<a name="module_oakdatastore..deleteNamespace_P"></a>
### oakdatastore~deleteNamespace_P(datastore, namespace) ⇒ <code>Promise</code>
deletes all entities in a namespace

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Promise</code> - warning: this may take a long time to complete  

| Param | Type | Description |
| --- | --- | --- |
| datastore | <code>Object</code> | gcloud-node datastore object |
| namespace | <code>string</code> | to wipe |

<a name="module_oakdatastore..workOnQuery_P"></a>
### oakdatastore~workOnQuery_P(datastore, gcloud-node, worker_P) ⇒ <code>Promise</code>
A helper function to process a query - warning: this may take a long time to complete

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Promise</code> - resolving to the final apiResponse  

| Param | Type | Description |
| --- | --- | --- |
| datastore | <code>Object</code> | gcloud-node datastore object |
| gcloud-node | <code>Object</code> | query object, as returned by createQuery() |
| worker_P | <code>function</code> | callback worker function which takes args: (datastore, entities) and must return a promise - will be called serially for larger datasets |

<a name="module_oakdatastore..createQuery"></a>
### oakdatastore~createQuery(datastore, kind, [namespace], [auto_paginate]) ⇒ <code>Object</code>
Create datastore query

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Object</code> - gcloud-node datastore/query object  

| Param | Type | Description |
| --- | --- | --- |
| datastore | <code>Object</code> | gcloud-node datastore object |
| kind | <code>string</code> |  |
| [namespace] | <code>string</code> | optional namespace |
| [auto_paginate] | <code>bool</code> | set false to manually page through results (default: true) |

<a name="module_oakdatastore..runQuery"></a>
### oakdatastore~runQuery(handle, query, [callback])
Run gcloud-node datastore query, a functional-style helper

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  

| Param | Type | Description |
| --- | --- | --- |
| handle | <code>Object</code> | gcloud-node datastore or transaction object |
| query | <code>Object</code> | created by createQuery() |
| [callback] | <code>function</code> | optional callback to run with query results in form function(err, entities, nextQuery, apiResponse) |

<a name="module_oakdatastore..makeEntity"></a>
### oakdatastore~makeEntity(key, data) ⇒ <code>Object</code>
Make entity helper

**Kind**: inner method of <code>[oakdatastore](#module_oakdatastore)</code>  
**Returns**: <code>Object</code> - entity  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>Object</code> | gcloud-node datastore key |
| data | <code>Object</code> | to be stored in entity value |


## Update Docs
```
jsdoc2md --template doc/README.hbs build/index.js  > README.md
```

Perhaps this would be helpful:
```
npm install -g jsdoc-to-markdown
```

## Development

Either use the atom babel package, or use gulp and babel to transpile from src to build.

### Test

`npm test`
or
`npm run testwatch`
or
`npm test -- watch`


### Atom Setup Tips

Use of the atom editor is not required. But if you choose to use atom here are some tips.

#### Install Atom Packages
`apm install linter linter-eslint language-babel editorconfig`

#### linter Settings
* Uncheck `Lint on fly`

#### linter-eslint Settings
* check `Disable When NoEslintrc File In Path`
* uncheck `Use Global Eslint` (unchecking seems to be necessary in order to use es2016)

#### language-babel Settings
* check `Transpile On Save`
* `src` in `Babel Source Path`
* `build` in `Babel Transpile Path`
* put `runtime` in `Optional Transformers`
