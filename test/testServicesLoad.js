var should = require('should'),
    mocha = require('mocha');

describe('Checks if services can be loaded', function() {

    it('should successfully load services', function(done) {
        var services = require('../services.js');

        services.load(__dirname + '/services' );
        var allServices = services.getServices();
        var servicesConfig = services.getConfig();
        // console.log('restapi config:', servicesConfig);
        servicesConfig.should.be.instanceof(Object);
        servicesConfig.should.have.property('projectName', 'rest-tool-common');
        servicesConfig.should.have.property('apiVersion', 'v0.0.0');
        servicesConfig.should.have.property('author', 'TomBenke');
        servicesConfig.should.have.property('licence', 'MIT');
        servicesConfig.should.have.property('serviceUrlPrefix', '/rest');
        servicesConfig.should.have.property('servicePort', 3007);
        servicesConfig.should.have.property('baseUrl', 'http://localhost:3007/rest');
        servicesConfig.should.have.property('servicesRoot', '.');
        done();
    });
});