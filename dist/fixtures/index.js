'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oasBasePath = exports.v2CombinedNonStaticEndpoints = exports.v2CombinedStaticEndpoints = exports.v3PetStoreSimpleEndpoints = exports.v2PetStoreSimpleEndpoints = exports.v2PetStoreSimpleOasModel = undefined;

var _datafile = require('datafile');

var v2PetStoreSimpleOasModel = exports.v2PetStoreSimpleOasModel = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-petstore-simple-oasmodel.json');
var v2PetStoreSimpleEndpoints = exports.v2PetStoreSimpleEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-petstore-simple-endpoints.json');
var v3PetStoreSimpleEndpoints = exports.v3PetStoreSimpleEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v3-petstore-separate-endpoints.json');
var v2CombinedStaticEndpoints = exports.v2CombinedStaticEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-combined-static-endpoints.json');
var v2CombinedNonStaticEndpoints = exports.v2CombinedNonStaticEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-combined-nonstatic-endpoints.json');
var oasBasePath = exports.oasBasePath = __dirname + '/oas/';