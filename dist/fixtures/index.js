'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oasBasePath = exports.v3PetStoreSimpleEndpoints = exports.v2PetStoreSimpleEndpoints = undefined;

var _datafile = require('datafile');

var v2PetStoreSimpleEndpoints = exports.v2PetStoreSimpleEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v2-petstore-simple-endpoints.json');
var v3PetStoreSimpleEndpoints = exports.v3PetStoreSimpleEndpoints = (0, _datafile.loadJsonFileSync)(__dirname + '/oas/v3-petstore-separate-endpoints.json');
var oasBasePath = exports.oasBasePath = __dirname + '/oas/';