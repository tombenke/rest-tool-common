/*jshint node: true */
'use strict';

const should = require('should')
const schemas = require('./schemas')
const path = require('path')

/**
 * Validate the testCase object
 * @param  {Object} testCase  The testCase object to validate
 * @return {Boolean}          true if successfully validated, false otherwise
 */
const validateTestCase = function (testCase) {
    const schemaBasePath = __dirname + '/../schemas/'

    // Validate service
    testCase.should.have.property('service')
    testCase.service.should.be.instanceof(Object)
    testCase.service.should.have.property('name')
    testCase.service.should.have.property('description')
    testCase.service.should.have.property('uriTemplate')
    testCase.service.should.have.property('style')
    testCase.service.style.should.match(/OPERATION|RESOURCE/)

    // Validate method
    testCase.should.have.property('method')
    testCase.method.should.match(/GET|PUT|POST|DELETE/)

    // Validate testCase
    testCase.should.have.property('testCase')
    testCase.testCase.should.be.instanceof(Object)
    schemas.validate(testCase.testCase, schemaBasePath, 'testCaseSchema.yml')

    return true
}


describe('Services', function() {

    it('#getAllTestCases()', function(done) {
        var services = require('./index').services

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allTestCases = services.getAllTestCases()

            // Validate each test-cases
            allTestCases.should.be.instanceof(Array)
            allTestCases.forEach(function(testCase) {
                validateTestCase(testCase)
            })

            done()
        }
    })
})
