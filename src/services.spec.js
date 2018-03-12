/*jshint node: true */
'use strict';

const services = require('./index').services;
const should = require('should')
const _ = require('lodash')
import {
    validate
} from 'datafile'
const path = require('path')
const schemaBasePath = __dirname + '/../schemas/'

/**
 * Validate the testCase object
 * @param  {Object} testCase  The testCase object to validate
 * @return {Boolean}          true if successfully validated, false otherwise
 */
const validateTestCase = function (testCase) {

    // Validate service
    testCase.should.have.property('service')
    testCase.service.should.be.instanceof(Object)
    testCase.service.should.have.property('name')
    testCase.service.should.have.property('description')
    testCase.service.should.have.property('uriTemplate')
    testCase.service.should.have.property('style')
    testCase.service.style.should.match(/OPERATION|RESOURCE|COLLECTION/)

    // Validate method
    testCase.should.have.property('method')
    testCase.method.should.match(/GET|PUT|POST|DELETE/)

    // Validate testCase
    testCase.should.have.property('testCase')
    testCase.testCase.should.be.instanceof(Object)
    validate(testCase.testCase, schemaBasePath, 'testCaseSchema.yml')

    return true
}

describe('services', function() {

    it('#load() - with default services path', function(done) {

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            done()
        }
    })

    it('#load() - with explicit services path', function(done) {

        if (services.load(path.resolve(__dirname, 'fixtures')) != null) {
            done()
        }
    })

    it('#getServices() - service descriptors are valid', function(done) {

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            let allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            let validationErrors = 0

            for (let s in allServices) {
                let service = allServices[s]
                let errors = validate(service, schemaBasePath, 'serviceSchema.yml')
                validationErrors += errors.length
            }
            if (validationErrors === 0) {
                done()
            }
        }
    })

    it('#getServices() - find all service descriptors', function(done) {

        const endpoints = services.load("/home/tombenke/topics/wat/wat-ui/dist/rest-api", 'services')
        //const endpoints = services.load(path.resolve(__dirname, 'fixtures'), 'services')
        if (endpoints != null) {
            const results = _.flatMap(endpoints, function(endpoint) {
                const uri = endpoint.uriTemplate
                const methods = endpoint.methodList
                return _.map(methods, function(method) {
                    return {
                            method: method.methodName.toLowerCase(),
                            uri: uri,
                            endpointDesc: endpoint
                        }
                    }
                )
            })
            done()
        }
    })

    it('#getAllTestCases()', function(done) {

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

    it('#testNoTestCases()', function(done) {

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            const allServices = services.getServices()
            allServices.should.be.instanceof(Object)

            const noTestCasesService = allServices['/defaults/noTestCases']

            // Check the default values
            noTestCasesService.should.have.property('style')
            noTestCasesService.style.should.equal('OPERATION')

            noTestCasesService.methods.GET.request.should.exist
            noTestCasesService.methods.GET.request.should.be.instanceOf(Object)

            noTestCasesService.methods.GET.request.parameters.should.be.instanceOf(Array)
            noTestCasesService.methods.GET.request.parameters.length.should.equal(0)

            noTestCasesService.methods.GET.request.headers.should.be.instanceOf(Array)
            noTestCasesService.methods.GET.request.headers.length.should.equal(0)

            noTestCasesService.methods.GET.request.cookies.should.be.instanceOf(Array)
            noTestCasesService.methods.GET.request.cookies.length.should.equal(0)

            noTestCasesService.methods.GET.testCases.length.should.equal(0)

            // If reached here, then fine.
            done()
        }
    })

    it('#getMockRequestBody()', function(done) {

        const expectedResult = {
            "id": 1,
            "name": "John Doe",
            "tags": ["picky"]
        }

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            services.getMockRequestBody('PUT', allServices['/customers/{id}']).should.be.eql(expectedResult)
            done()
        }
    })

    it('#getMockResponseBody()', function(done) {

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            services.getMockResponseBody('GET', allServices['/monitoring/isAlive'], 'OK').should.be.equal("The service is alive\n")
            done()
        }
    })

    it('#testDefaults()', function(done) {

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)

            // Check if each method and their request and response objects
            // have arrays of headers and cookies
            for (var serviceName in allServices) {
                if (allServices.hasOwnProperty(serviceName)) {
                    var service = allServices[serviceName]
                    var methods = service.methods

                    service.should.have.property('style')

                    for (var methodName in methods) {
                        if (methods.hasOwnProperty(methodName)) {
                            var method = methods[methodName]
                            method.request.should.exist
                            method.request.should.be.instanceOf(Object)

                            method.request.parameters.should.be.instanceOf(Array)
                            method.request.headers.should.be.instanceOf(Array)
                            method.request.cookies.should.be.instanceOf(Array)

                            method.testCases.should.be.instanceOf(Array)
                            method.testCases.forEach(function(testCase) {
                                testCase.request.should.exist
                                testCase.request.should.be.instanceOf(Object)
                                testCase.request.headers.should.be.instanceOf(Array)
                                testCase.request.cookies.should.be.instanceOf(Array)

                                testCase.response.should.exist
                                testCase.response.should.be.instanceOf(Object)
                                testCase.response.headers.should.be.instanceOf(Array)
                                testCase.response.cookies.should.be.instanceOf(Array)
                            })
                        }
                    }
                }
            }

            // If reached here, then fine.
            done()
        }
    })

    it('#testAliases()', function(done) {

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            const allServices = services.getServices()
            allServices.should.be.instanceof(Object)

            // Check the aliases for each services
            for (let serviceName in allServices) {
                if (allServices.hasOwnProperty(serviceName)) {
                    const service = allServices[serviceName]

                    service.should.have.property('urlPattern')
                    service.urlPattern.should.be.instanceOf(String)

                    service.should.have.property('uriTemplate')
                    service.uriTemplate.should.be.instanceOf(String)
                }
            }

            // If reached here, then fine.
            done()
        }
    })

})
