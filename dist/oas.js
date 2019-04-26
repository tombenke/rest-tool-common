'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getAllOpenApiEndpoints = exports.methodNames = exports.makeJsonicFriendly = exports.getAllSwaggerEndpoints = exports.isOpenApi = exports.isSwagger = exports.getEndpoints = exports.loadOas = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loadOas = exports.loadOas = function loadOas(oasFile) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return _swaggerParser2.default.validate(oasFile, options).then(function (api) {
        //console.log(JSON.stringify(api, null, 2))
        return {
            oasModel: api,
            getOasModel: function getOasModel() {
                return api;
            },
            getTitle: function getTitle() {
                return api.info.title;
            },
            getVersion: function getVersion() {
                return api.info.version;
            },
            getEndpoints: function getEndpoints() {
                return _getEndpoints(api);
            }
        };
    }).catch(function (err) {
        console.log(err);
        return Promise.reject(err);
    });
};

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
        return {
            uri: endpoint.uri,
            jsfUri: endpoint.jsfUri,
            method: endpoint.method,
            operationId: endpoint.operationId,
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