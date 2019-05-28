'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.removeExamples = exports.oasBasePath = exports.v2CombinedNonStaticEndpoints = exports.v2CombinedStaticEndpoints = exports.v3ApiWithExamplesEndpoints = exports.v2ApiWithExamplesEndpoints = exports.v3PetStoreSimpleEndpoints = exports.v2PetStoreSimpleEndpoints = exports.v2PetStoreSimpleOasModel = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _datafile = require('datafile');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var v2PetStoreSimpleOasModel = exports.v2PetStoreSimpleOasModel = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-petstore-simple-oasmodel.json');
var v2PetStoreSimpleEndpoints = exports.v2PetStoreSimpleEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-petstore-simple-endpoints.json');
var v3PetStoreSimpleEndpoints = exports.v3PetStoreSimpleEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v3-petstore-simple-endpoints.json');
var v2ApiWithExamplesEndpoints = exports.v2ApiWithExamplesEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-api-with-examples-endpoints.json');
var v3ApiWithExamplesEndpoints = exports.v3ApiWithExamplesEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v3-api-with-examples-endpoints.json');
var v2CombinedStaticEndpoints = exports.v2CombinedStaticEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-combined-static-endpoints.json');
var v2CombinedNonStaticEndpoints = exports.v2CombinedNonStaticEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-combined-nonstatic-endpoints.json');
var oasBasePath = exports.oasBasePath = __dirname + '/oas/';

var removeExamples = exports.removeExamples = function removeExamples(endpoints) {
        return _lodash2.default.map(endpoints, function (endpoint) {
                return _extends({}, endpoint, {
                        responses: _lodash2.default.mapValues(endpoint.responses, function (v, k, o) {
                                return _lodash2.default.omit(v, ['examples']);
                        })
                });
        });
};