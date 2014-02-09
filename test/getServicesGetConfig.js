var fs = require('fs'),
    jsyaml = require('js-yaml'),
    JaySchema = require('jayschema'),
    should = require('should'),
    mocha = require('mocha');

describe('Services', function() {

    it('#getConfig()', function(done) {
        var services = require('../lib/services.js');

        services.load(__dirname + '/services' );
        var allServices = services.getServices();
        var servicesConfig = services.getConfig();

        // Validate whether the structure confonrms to the schema
        var js = new JaySchema();
        var schema = jsyaml.load(fs.readFileSync('schemas/serviceConfigSchema.yml','utf-8'));

        var errors = js.validate(servicesConfig, schema);
        // });

        if (errors.length > 0) {
            errors.forEach(function(error) {
                console.log(JSON.stringify(error, null, '  '));
            });
            done('Validation error');
        } else {
            // Validate contentwise
            servicesConfig.should.be.instanceof(Object);
            servicesConfig.should.have.property('projectName', 'rest-tool-common');
            servicesConfig.should.have.property('apiVersion', 'v0.0.0');
            servicesConfig.should.have.property('author', 'TomBenke');
            servicesConfig.should.have.property('licence', 'MIT');
            servicesConfig.should.have.property('serviceUrlPrefix', '/rest');
            servicesConfig.should.have.property('servicePort', 3007);
            servicesConfig.should.have.property('baseUrl', 'http://localhost:3007/rest');
            servicesConfig.should.have.property('servicesRoot', '.');
            servicesConfig.should.have.property('services');
            servicesConfig.services.should.be.instanceof(Array);

            done();
        }
    });
});