/*jshint node: true */
'use strict'

import _ from 'lodash'
import { services } from './index'
import should from 'should'
import { validate } from 'datafile'
import path from 'path'
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

describe('services', function () {
    it('#load() - with default services path', function (done) {
        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            done()
        }
    })

    it('#load() - with explicit services path', function (done) {
        if (services.load(path.resolve(__dirname, 'fixtures/services')) != null) {
            done()
        }
    })

    it('#getServices() - service descriptors are valid', function (done) {
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

    it('#getAllTestCases()', function (done) {
        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allTestCases = services.getAllTestCases()

            // Validate each test-cases
            allTestCases.should.be.instanceof(Array)
            allTestCases.forEach(function (testCase) {
                validateTestCase(testCase)
            })

            done()
        }
    })

    it('#testNoTestCases()', function (done) {
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

    it('#getMockRequestBody()', function (done) {
        const expectedResult = {
            id: 1,
            name: 'John Doe',
            tags: ['picky']
        }

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            services.getMockRequestBody('PUT', allServices['/customers/{id}']).should.be.eql(expectedResult)
            done()
        }
    })

    it('#getMockResponseBody()', function (done) {
        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            services
                .getMockResponseBody('GET', allServices['/monitoring/isAlive'], 'OK')
                .should.be.equal('The service is alive\n')
            done()
        }
    })

    it('#getImplementation()', function (done) {
        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            services.getImplementation(allServices['/customers'], 'get').should.be.equal('api.getCustomers')
            done()
        }
    })

    it('#getRequestHeaders()', function (done) {
        const expectedResult = [
            {
                Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            {
                'Accept-Encoding': 'gzip, deflate'
            }
        ]

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            services.getRequestHeaders('get', allServices['/customers/{id}']).should.be.eql(expectedResult)
            done()
        }
    })

    it('#getResponseHeaders()', function (done) {
        const expectedResult = [
            {
                'Content-Type': 'application/json'
            },
            {
                'X-Application-Version': 'v0.4'
            },
            {
                'X-Application-API-Version': 'v0.1'
            }
        ]

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            services.getResponseHeaders('GET', allServices['/customers/{id}'], 'OK').should.be.eql(expectedResult)
            done()
        }
    })

    it('#testDefaults()', function (done) {
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
                            method.testCases.forEach(function (testCase) {
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

    it('#testAliases()', function (done) {
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

    it('#getAllStaticEndpoints()', function (done) {
        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            const allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            const statics = services.getAllStaticEndpoints()
            _.map(statics, (staticDesc) => {
                _.map(['name', 'description', 'uriTemplate', 'contentPath', 'config'], (prop) => {
                    staticDesc.should.have.property(prop)
                })
            })

            done()
        }
    })
})
