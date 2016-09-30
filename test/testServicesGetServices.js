#!/usr/bin/env node
/*jshint node: true */
'use strict';

var fs = require('fs');
var should = require('should');
var schemas = require('../lib/schemas.js');
var mocha = require('mocha');
var path = require('path');

describe('Services', function() {

    it('#getServices()', function(done) {
        var services = require('../index').services;

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') === null) {
            done('ERROR: services.load unsuccessful.');
        } else {
            var allServices = services.getServices();
            allServices.should.be.instanceof(Object);

            var validationError = false;

            for (var s in allServices ) {
                var service = allServices[s];
                var errors = schemas.validate(service, 'serviceSchema.yml');
                if (errors.length > 0) {
                    errors.forEach(function(error) {
                        console.log(JSON.stringify(error, null, '  '));
                        validationError = true;
                    });
                }
            }

            if (validationError) {
                done('Validation error');
            }
            done();
        }
    });
});
