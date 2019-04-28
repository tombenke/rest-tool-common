'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAllOpenApiEndpoints = exports.methodNames = exports.makeJsonicFriendly = exports.getAllSwaggerEndpoints = exports.isOpenApi = exports.isSwagger = exports.getEndpoints = exports.getNonStaticEndpoints = exports.getStaticEndpoints = exports.loadOas = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * A module that loads swagger and OpenAPI 3.0 format API specifications
                                                                                                                                                                                                                                                                   * and provides the service endpoint descriptors
                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                   * @module oas
                                                                                                                                                                                                                                                                   */

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Load swagger and/or OpenAPI specification
 * The specification can be a single file, or that can made of several partials.
 *
 * @arg {String} oasFile - The path of the root file of the API specification.
 * @arg {Object} options - The options of the loader. See [swagger-parser options](https://apidevtools.org/swagger-parser/docs/options.html) for details.
 *
 * @return {Promise} A Promise, that resolves to an API descriptor object, that provides inner functions to access to the individual endpoints as well as to the whole loaded model.
 *
 * @function
 * @async
 */
var loadOas = exports.loadOas = function loadOas(oasFile) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _swaggerParser2.default.validate(oasFile, options).then(function (api) {
        return {
            /**
             * The Original OpenAPI model as it was loaded
             */
            oasModel: api,

            /**
             * Return with the original OAS model
             * @function
             */
            getOasModel: function getOasModel() {
                return api;
            },

            /**
             * Get the title of the API
             * @return {String} - The title of the API
             * @function
             */
            getTitle: function getTitle() {
                return api.info.title;
            },

            /**
             * Get the version of the API
             * @return {String} - The version of the API
             * @function
             */
            getVersion: function getVersion() {
                return api.info.version;
            },

            /**
             * Get all the endpoins defined by the API
             * @return {Array} - The array of endpoints of the API
             * @function
             */
            getEndpoints: function getEndpoints() {
                return _getEndpoints(api);
            },

            /**
             * Get the static endpoins defined by the API
             * @return {Array} - The array of static endpoints of the API
             * @function
             */
            getStaticEndpoints: function getStaticEndpoints() {
                return _getStaticEndpoints(api);
            },

            /**
             * Get the normal REST endpoins defined by the API
             * @return {Array} - The array of normal, (non-static, REST) endpoints of the API
             * @function
             */
            getNonStaticEndpoints: function getNonStaticEndpoints() {
                return _getNonStaticEndpoints(api);
            }
        };
    }).catch(function (err) {
        return Promise.reject(err);
    });
};

var _getStaticEndpoints = function _getStaticEndpoints(oasApi) {
    return _lodash2.default.filter(_getEndpoints(oasApi), function (endpoint) {
        return _lodash2.default.has(endpoint, 'static');
    });
};
exports.getStaticEndpoints = _getStaticEndpoints;
var _getNonStaticEndpoints = function _getNonStaticEndpoints(oasApi) {
    return _lodash2.default.filter(_getEndpoints(oasApi), function (endpoint) {
        return !_lodash2.default.has(endpoint, 'static');
    });
};

exports.getNonStaticEndpoints = _getNonStaticEndpoints;
var _getEndpoints = function _getEndpoints(oasApi) {
    return isSwagger(oasApi) ? getAllSwaggerEndpoints(oasApi) : isOpenApi(oasApi) ? getAllOpenApiEndpoints(oasApi) : [];
};

exports.getEndpoints = _getEndpoints;
var isSwagger = exports.isSwagger = function isSwagger(oasApi) {
    return _lodash2.default.get(oasApi, 'swagger', '').match(/^2\.0.*/);
};

var isOpenApi = exports.isOpenApi = function isOpenApi(oasApi) {
    return _lodash2.default.get(oasApi, 'openapi', '').match(/^3\.0.*/);
};

var getAllSwaggerEndpoints = exports.getAllSwaggerEndpoints = function getAllSwaggerEndpoints(swaggerApi) {
    return _lodash2.default.chain(
    // Get all paths as a list, including the path value as an 'uri' property
    _lodash2.default.values(_lodash2.default.mapValues(swaggerApi.paths, function (v, k, o) {
        return _extends({
            uri: k
        }, v);
    }))).flatMap(function (path) {
        return _lodash2.default.flatMap(methodNames, function (methodName) {
            return _lodash2.default.get(path, methodName, null) ? [_extends({
                uri: path.uri,
                jsfUri: makeJsonicFriendly(path.uri),
                method: methodName
            }, path[methodName])] : [];
        });
    }).map(function (endpoint) {
        return _lodash2.default.has(endpoint, 'x-static') ? {
            uri: endpoint.uri,
            static: endpoint['x-static']
        } : {
            uri: endpoint.uri,
            jsfUri: endpoint.jsfUri,
            method: endpoint.method,
            operationId: _lodash2.default.get(endpoint, 'operationId', null),
            consumes: _lodash2.default.get(endpoint, 'consumes', _lodash2.default.get(swaggerApi, 'consumes', [])),
            produces: _lodash2.default.get(endpoint, 'produces', _lodash2.default.get(swaggerApi, 'produces', []))
        };
    }).value();
};

var makeJsonicFriendly = exports.makeJsonicFriendly = function makeJsonicFriendly(uri) {
    return uri.replace(/\{/g, ':').replace(/\}/g, '');
};

var methodNames = exports.methodNames = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

var getAllOpenApiEndpoints = exports.getAllOpenApiEndpoints = getAllSwaggerEndpoints; // The minimal version returns with the same properties