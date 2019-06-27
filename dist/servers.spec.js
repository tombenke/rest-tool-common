'use strict';

var _should = require('should');

var _should2 = _interopRequireDefault(_should);

var _servers = require('./servers');

var _fixtures = require('./fixtures/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('servers', function () {
    var testGetSwaggerServers = function testGetSwaggerServers(testCase) {
        var oasModel = testCase.config;
        var expected = testCase.expected;

        var servers = (0, _servers.getSwaggerServers)(oasModel);
        servers.should.be.eql(expected);
        return;
    };

    var testGetOpenApiServers = function testGetOpenApiServers(testCase) {
        var oasModel = testCase.config;
        var expected = testCase.expected;

        var servers = (0, _servers.getOpenApiServers)(oasModel);
        servers.should.be.eql(expected);
        return;
    };

    it('#getSwaggerServers - none', function (done) {
        testGetSwaggerServers(_fixtures.oasModels.v2.none);
        done();
    });

    it('#getSwaggerServers - plain', function (done) {
        testGetSwaggerServers(_fixtures.oasModels.v2.plain);
        done();
    });

    it('#getSwaggerServers - withPort', function (done) {
        testGetSwaggerServers(_fixtures.oasModels.v2.withPort);
        done();
    });

    it('#getSwaggerServers - withPortandSchemas', function (done) {
        testGetSwaggerServers(_fixtures.oasModels.v2.withPortAndSchemas);
        done();
    });

    it('#getOpenApiServers - none', function (done) {
        testGetOpenApiServers(_fixtures.oasModels.v3.none);
        done();
    });

    it('#getOpenApiServers - plain', function (done) {
        testGetOpenApiServers(_fixtures.oasModels.v3.plain);
        done();
    });

    it('#getOpenApiServers - plainWithPort', function (done) {
        testGetOpenApiServers(_fixtures.oasModels.v3.plainWithPort);
        done();
    });
});