#!/usr/bin/env node
/*jshint node: true */
'use strict';

var fs = require('fs'),
    should = require('should'),
    schemas = require('../lib/schemas.js'),
    mocha = require('mocha');
var path = require('path');

describe('Services', function() {

    it('#testAliases()', function(done) {
        var services = require('../index').services;

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') === null) {
            done('ERROR: services.load unsuccessful.');
        } else {
            var allServices = services.getServices();
            allServices.should.be.instanceof(Object);

            // Check the aliases for each services
            for (var serviceName in allServices) {
                if (allServices.hasOwnProperty(serviceName)) {
                    var service = allServices[serviceName];

                    service.should.have.property('urlPattern');
                    service.urlPattern.should.be.instanceOf(String);

                    service.should.have.property('uriTemplate');
                    service.uriTemplate.should.be.instanceOf(String);
                }
            }

            // If reached here, then fine.
            done();
        }
    });
});
