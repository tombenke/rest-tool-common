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

    it('#loadOas() - from swagger object - default config', function (done) {
        (0, _oas.loadOas)(_fixtures.v2PetStoreSimpleOasModel).then(function (api) {
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

    it('#getServers - v2.0', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml');
        var expected = [{ protocol: 'http', hostName: 'petstore.swagger.io', port: 80, basePath: '/api' }];
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var apiServers = api.getServers();
            apiServers.should.be.eql(expected);
            done();
        });
    });

    it('#getServers - v3.0', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v3.0/petstore.yaml');
        var expected = [{ protocol: 'http', hostName: 'petstore.swagger.io', port: 80, basePath: '/v1' }];
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var apiServers = api.getServers();
            apiServers.should.be.eql(expected);
            done();
        });
    });

    it('#getEndpoints - from v2.0', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/petstore-simple.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var endpoints = api.getEndpoints();
            endpoints.should.be.eql((0, _fixtures.removeExamples)(_fixtures.v2PetStoreSimpleEndpoints));
            done();
        });
    });

    it('#getEndpoints - from v3.0', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v3.0/petstore-expanded.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var endpoints = api.getEndpoints();
            endpoints.should.be.eql((0, _fixtures.removeExamples)(_fixtures.v3PetStoreSimpleEndpoints));
            done();
        });
    });

    it('#getStaticEndpoints() - from combined', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/combined/api.yml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var staticEndpoints = api.getStaticEndpoints();
            staticEndpoints.should.be.eql(_fixtures.v2CombinedStaticEndpoints);
            done();
        });
    });

    it('#getStaticEndpoints() - from combined with options', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/combined/api.yml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var staticEndpoints = api.getStaticEndpoints({});
            staticEndpoints.should.be.eql(_fixtures.v2CombinedStaticEndpoints);
            done();
        });
    });

    it('#getNonStaticEndpoints() - from combined', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/combined/api.yml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var nonStaticEndpoints = api.getNonStaticEndpoints();
            nonStaticEndpoints.should.be.eql((0, _fixtures.removeExamples)(_fixtures.v2CombinedNonStaticEndpoints));
            done();
        });
    });

    it('#getNonStaticEndpoints() - from combined with options', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/combined/api.yml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var nonStaticEndpoints = api.getNonStaticEndpoints({});
            nonStaticEndpoints.should.be.eql((0, _fixtures.removeExamples)(_fixtures.v2CombinedNonStaticEndpoints));
            done();
        });
    });

    it('#getEndpoints - from v2.0 with examples - do not include examples', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/api-with-examples.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var endpoints = api.getEndpoints();
            endpoints.should.be.eql((0, _fixtures.removeExamples)(_fixtures.v2ApiWithExamplesEndpoints));
            done();
        });
    });

    it('#getEndpoints - from v3.0 with examples - do not include examples', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v3.0/api-with-examples.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var endpoints = api.getEndpoints();
            endpoints.should.be.eql((0, _fixtures.removeExamples)(_fixtures.v3ApiWithExamplesEndpoints));
            done();
        });
    });

    it('#getEndpoints - from v2.0 with examples - include examples', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v2.0/yaml/api-with-examples.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var endpoints = api.getEndpoints({ includeExamples: true });
            endpoints.should.be.eql(_fixtures.v2ApiWithExamplesEndpoints);
            done();
        });
    });

    it('#getEndpoints - from v3.0 with examples - include examples', function (done) {
        var oasFile = _path2.default.resolve(_fixtures.oasBasePath, 'v3.0/api-with-examples.yaml');
        (0, _oas.loadOas)(oasFile, oasConfig).then(function (api) {
            var endpoints = api.getEndpoints({ includeExamples: true });
            endpoints.should.be.eql(_fixtures.v3ApiWithExamplesEndpoints);
            done();
        });
    });
});