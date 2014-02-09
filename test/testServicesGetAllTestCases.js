/*jshint node: true */
'use strict';

var should = require('should'),
    mocha = require('mocha'),
    validate = require('./validator.js').Validator();

describe('Services', function() {

    it('#getAllTestCases()', function(done) {
        var services = require('../lib/services.js');

        services.load(__dirname + '/services' );
        var allTestCases = services.getAllTestCases();

        // Validate each test-cases
        allTestCases.should.be.instanceof(Array);
        allTestCases.forEach(function(testCase) {
            validate.testCase(testCase);
        });

        done();
    });
});