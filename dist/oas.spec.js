'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _oas = require('./oas');

var _fixtures = require('./fixtures/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var oasConfig = {
    parse: {
        yaml: {
            allowEmpty: false // Don't allow empty YAML files
        },
        resolve: {
            file: true // Resolve local file references
        }
    }
};

describe('oas', function () {
    it('#loadOas() - from file', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (res) {
            return done();
        });
    });

    it('#loadOas() - from swagger object', function (done) {
        (0, _oas.loadOas)(_fixtures.v2PetStoreSimpleOasModel, oasConfig).then(function (api) {
            var oasModel = api.getOasModel();
            oasModel.should.be.eql(_fixtures.v2PetStoreSimpleOasModel);
            done();
        });
    });

    it('#loadOas() - fails', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'non-existing-api-file');
        (0, _oas.loadOas)(oasFile, oasConfig).catch(function (res) {
            return done();
        });
    });

    it('#getOasModel', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var oasModel = api.getOasModel();
            oasModel.should.be.eql(_fixtures.v2PetStoreSimpleOasModel);
            done();
        });
    });

    it('#getVersion', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var apiVersion = api.getVersion();
            apiVersion.should.be.equal('1.0.0');
            done();
        });
    });

    it('#getTitle', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var apiTitle = api.getTitle();
            apiTitle.should.be.equal('Swagger Petstore');
            done();
        });
    });

    it('#getEndpoints - from v2.0', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/petstore-simple.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var endpoints = api.getEndpoints();
            endpoints.should.be.eql(_fixtures.v2PetStoreSimpleEndpoints);
            done();
        });
    });

    it('#getEndpoints - from v3.0', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v3.0/petstore-expanded.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var endpoints = api.getEndpoints();
            endpoints.should.be.eql(_fixtures.v3PetStoreSimpleEndpoints);
            done();
        });
    });

    it('#getStaticEndpoints() - from combined', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/combined/api.yml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var staticEndpoints = api.getStaticEndpoints();
            staticEndpoints.should.be.eql(_fixtures.v2CombinedStaticEndpoints);
            var nonStaticEndpoints = api.getNonStaticEndpoints();
            nonStaticEndpoints.should.be.eql(_fixtures.v2CombinedNonStaticEndpoints);
            done();
        });
    });
});