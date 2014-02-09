var fs = require('fs'),
    jsyaml = require('js-yaml'),
    should = require('should'),
    mocha = require('mocha');

describe('Services', function() {

    it('#getServices()', function(done) {
        var services = require('../lib/services.js');

        services.load(__dirname + '/services' );
        var allServices = services.getServices();
        console.log('allServices:', allServices);
        allServices.should.be.instanceof(Object);

        var JaySchema = require('jayschema');
        var js = new JaySchema();
        var schema = jsyaml.load(fs.readFileSync('schemas/serviceSchema.yml','utf-8'));
        var errors = [];

        for (var s in allServices ) {
            var service = allServices[s];
            errors = js.validate(service, schema);
            if (errors.length > 0) {
                errors.forEach(function(error) {
                    console.log(JSON.stringify(error, null, '  '));
                });
                done('Validation error');
            }
        }

        done();
    });
});