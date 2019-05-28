'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getExamplesFromV3Content = exports.openApiEndpointExtractor = exports.swaggerEndpointExtractor = exports.methodNames = exports.makeJsonicFriendly = exports.makeOperationEndpoint = exports.makeStaticEndpoint = exports.getAllEndpoints = exports.isOpenApi = exports.isSwagger = exports.getEndpoints = exports.getNonStaticEndpoints = exports.getStaticEndpoints = exports.loadOas = undefined;

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
 * It also can be a swagger object.
 *
 * @arg {String|Object} oasFile - The path string of the root file of the API specification, or a swagger object.
 * @arg {Object} oasOptions - The options of the loader. See [swagger-parser options](https://apidevtools.org/swagger-parser/docs/options.html) for details.
 * @arg {Object} endpointOptions - The options of the endpoint descriptors. See defaultEndpointOptions for details.
 *
 * @return {Promise} A Promise, that resolves to an API descriptor object, that provides inner functions to access to the individual endpoints as well as to the whole loaded model.
 *
 * @function
 * @async
 */
var loadOas = exports.loadOas = function loadOas(oasFile) {
    var oasOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _swaggerParser2.default.validate(oasFile, oasOptions).then(function (api) {
        var endpointOptions = function endpointOptions(options) {
            return _lodash2.default.merge({
                includeExamples: false
            }, options);
        };

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
             * @arg {Object} - The options that control the details of endpoints of the API. Optional. Defaults: `{ includeExamples: false }`.
             * @return {Array} - The array of endpoints of the API
             * @function
             */
            getEndpoints: function getEndpoints() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                return _getEndpoints(api, endpointOptions(options));
            },

            /**
             * Get the static endpoins defined by the API
             * @arg {Object} - The options that control the details of endpoints of the API. Optional. Defaults: `{ includeExamples: false }`.
             * @return {Array} - The array of static endpoints of the API
             * @function
             */
            getStaticEndpoints: function getStaticEndpoints() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                return _getStaticEndpoints(api, endpointOptions(options));
            },

            /**
             * Get the normal REST endpoins defined by the API
             * @arg {Object} - The options that control the details of endpoints of the API. Optional. Defaults: `{ includeExamples: false }`.
             * @return {Array} - The array of normal, (non-static, REST) endpoints of the API
             * @function
             */
            getNonStaticEndpoints: function getNonStaticEndpoints() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                return _getNonStaticEndpoints(api, endpointOptions(options));
            }
        };
    }).catch(function (err) {
        return Promise.reject(err);
    });
};

var _getStaticEndpoints = function _getStaticEndpoints(oasApi, options) {
    return _lodash2.default.filter(_getEndpoints(oasApi, options), function (endpoint) {
        return _lodash2.default.has(endpoint, 'static');
    });
};
exports.getStaticEndpoints = _getStaticEndpoints;
var _getNonStaticEndpoints = function _getNonStaticEndpoints(oasApi, options) {
    return _lodash2.default.filter(_getEndpoints(oasApi, options), function (endpoint) {
        return !_lodash2.default.has(endpoint, 'static');
    });
};

exports.getNonStaticEndpoints = _getNonStaticEndpoints;
var _getEndpoints = function _getEndpoints(oasApi, options) {
    return isSwagger(oasApi) ? getAllEndpoints(oasApi, swaggerEndpointExtractor(options)) : isOpenApi(oasApi) ? getAllEndpoints(oasApi, openApiEndpointExtractor(options)) : [];
};

exports.getEndpoints = _getEndpoints;
var isSwagger = exports.isSwagger = function isSwagger(oasApi) {
    return _lodash2.default.get(oasApi, 'swagger', '').match(/^2\.0.*/);
};

var isOpenApi = exports.isOpenApi = function isOpenApi(oasApi) {
    return _lodash2.default.get(oasApi, 'openapi', '').match(/^3\.0.*/);
};

var getAllEndpoints = exports.getAllEndpoints = function getAllEndpoints(swaggerApi, responseExtractor) {
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
        return _lodash2.default.has(endpoint, 'x-static') ? makeStaticEndpoint(swaggerApi, endpoint, responseExtractor) : makeOperationEndpoint(swaggerApi, endpoint, responseExtractor);
    }).value();
};

var makeStaticEndpoint = exports.makeStaticEndpoint = function makeStaticEndpoint(swaggerApi, endpoint) {
    return {
        uri: endpoint.uri,
        static: endpoint['x-static']
    };
};

var makeOperationEndpoint = exports.makeOperationEndpoint = function makeOperationEndpoint(api, endpoint, responseExtractor) {
    return {
        uri: endpoint.uri,
        jsfUri: endpoint.jsfUri,
        method: endpoint.method,
        operationId: _lodash2.default.get(endpoint, 'operationId', null),
        consumes: _lodash2.default.get(endpoint, 'consumes', _lodash2.default.get(api, 'consumes', [])),
        produces: _lodash2.default.get(endpoint, 'produces', _lodash2.default.get(api, 'produces', [])),
        responses: responseExtractor(api, endpoint)
    };
};

var makeJsonicFriendly = exports.makeJsonicFriendly = function makeJsonicFriendly(uri) {
    return uri.replace(/\{/g, ':').replace(/\}/g, '');
};

var methodNames = exports.methodNames = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch'];

var swaggerEndpointExtractor = exports.swaggerEndpointExtractor = function swaggerEndpointExtractor(options) {
    return function (api, endpoint) {
        return _lodash2.default.chain(_lodash2.default.values(_lodash2.default.mapValues(endpoint.responses, function (v, k, o) {
            return {
                status: k,
                headers: _lodash2.default.get(v, 'headers', {}),
                examples: _lodash2.default.mapValues(_lodash2.default.get(v, 'examples', {}), function (v, k, o) {
                    return { noname: { mimeType: k, value: v } };
                })
            };
        })).map(function (endpoint) {
            return options.includeExamples ? endpoint : _lodash2.default.omit(endpoint, ['examples']);
        }).reduce(function (accu, v, k) {
            accu[v.status] = v;
            return accu;
        }, {})).value();
    };
};

var openApiEndpointExtractor = exports.openApiEndpointExtractor = function openApiEndpointExtractor(options) {
    return function (api, endpoint) {
        return _lodash2.default.chain(_lodash2.default.values(_lodash2.default.mapValues(endpoint.responses, function (v, k, o) {
            return {
                status: k,
                headers: _lodash2.default.get(v, 'headers', {}),
                examples: getExamplesFromV3Content(_lodash2.default.get(v, 'content', {}))
            };
        })).map(function (endpoint) {
            return options.includeExamples ? endpoint : _lodash2.default.omit(endpoint, ['examples']);
        }).reduce(function (accu, v, k) {
            accu[v.status] = v;
            return accu;
        }, {})).value();
    };
};

var getExamplesFromV3Content = exports.getExamplesFromV3Content = function getExamplesFromV3Content(content, mimeType) {
    return _lodash2.default.mapValues(content, function (mimeTypeValue, mimeType, mto) {
        return _lodash2.default.has(mimeTypeValue, 'example') ? { noname: { mimeType: mimeType, value: mimeTypeValue.example } // Return with example
        } : _lodash2.default.has(mimeTypeValue, 'examples') ? _lodash2.default.mapValues(mimeTypeValue.examples, function (v, k, o) {
            return {
                // Return with examples
                mimeType: mimeType,
                value: _lodash2.default.has(v, 'externalValue') ? v.externalValue : _lodash2.default.get(v, 'value', null)
            };
        }) : {};
    });
}; // Neither examples nor example are defined