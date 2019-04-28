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
    it('#loadOas()', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (res) {
            return done();
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
            console.log(JSON.stringify(staticEndpoints, null, 2));
            staticEndpoints.should.be.eql(_fixtures.v2CombinedStaticEndpoints);
            var nonStaticEndpoints = api.getNonStaticEndpoints();
            console.log(JSON.stringify(nonStaticEndpoints, null, 2));
            nonStaticEndpoints.should.be.eql(_fixtures.v2CombinedNonStaticEndpoints);
            done();
        });
    });
});