#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * A module that loads and provides the service endpoint descriptors
 *
 * @module services
 */

import path from 'path'
import * as _ from 'lodash'
import {
    validate,
    findFilesSync,
    loadJsonFileSync,
    loadTextFileSync
} from 'datafile'
//const schemas = require('/schemas/')
const schemaBasePath = __dirname + '/../schemas/'

/** Descriptors object, that holds all services and provides details */
let services = {}

/**
 * Maps through each own properties of an object, and calls the given function with it
 *
 * @arg {Object} obj     - The object to map within its own properties.
 * @arg {Function} funct - The map function with the following signature: `function(property, propertyName)`,
 * where `propertyName` is the name of the property, and `property` is its value.
 */
const mapOwnProperties = function(obj, func) {
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
            func(obj[property], property)
        }
    }
}

/**
 * Load all service descriptors
 *
 * @arg {String} restapiRoot  - The path to the main config file of the services named: `config.yml`.
 * @arg {String} servicesRoot - The path to the root folder where the service descriptors are placed.
 *
 * @return {Object} - The Object, which holds all service descriptors, using the URI patterns as keys.
 * in case of error returns with `null`.
 *
 * @function
 */
exports.load = (restapiRoot, servicesRoot='services') => {
    const fullServicesRoot = path.resolve(restapiRoot, servicesRoot)
    const servicesToLoad = _.map(findFilesSync(fullServicesRoot, /.*service\.yml$/), servicePath =>
        servicePath.replace(fullServicesRoot, '').replace('/service.yml', ''))

    return loadServices(restapiRoot, servicesRoot, servicesToLoad)
}

/**
 * Create and update the method list property of a service descriptor object.
 *
 * Creates a `methodList` property of the service descriptor, and fills the list with references
 * to the original method sub-objects. It results a service descriptor, that's methods can be accessed
 * both via the method name as well as via an element of an array, which holds all the methods.
 *
 * Note: The original service descriptor object will be changed.
 *
 * @arg {Object} serviceDescriptor - The service descriptor object
 *
 * @function
 */
const updateMethodLists = serviceDescriptor => {
    serviceDescriptor.methodList = []

    for (let method in serviceDescriptor.methods) {
        if (serviceDescriptor.methods.hasOwnProperty(method)) {
            serviceDescriptor.methods[method].methodName = method
            serviceDescriptor.methodList.push(serviceDescriptor.methods[method])
        }
    }
}

/**
 * Set alias property to a specific part of a serviceDescriptor object.
 *
 * It adds a property that will refer to an other property, that the new property is an alias of
 * In case the object has the named alias property yet, then it does not change its value, however
 * it also checks if the original property exists. In case the alias exists but the original does not
 * exists, then it creates a property with the original name, that will refer to the alias property.
 *
 * Note: The original object will be changed.
 *
 * @arg {Object} object - The (sub)-object of the full descriptor
 * @arg {String} property - The property name
 * @arg {AnyType} alias - The alias property the alias will point
 */
const setAlias = function(object, property, alias) {
    if (object.hasOwnProperty(property) && !object.hasOwnProperty(alias)) {
        object[alias] = object[property]
    } else if (object.hasOwnProperty(alias) && !object.hasOwnProperty(property)) {
        object[property] = object[alias]
    }
}

/**
 * Set alias properties to a serviceDescriptor object.
 *
 * It adds properties in several places of the descriptor and changes the original object.
 *
 * Note: The original service descriptor object will be changed.
 *
 * @arg {Object} serviceDescriptor - The service descriptor object
 */
const setAliases = function(serviceDescriptor) {
    setAlias(serviceDescriptor, 'urlPattern', 'uriTemplate')
}

/**
 * Set default value to a specific part of a serviceDescriptor object.
 *
 * It adds a property with a default value to the descriptor and changes the original object.
 * In case the object has the named property yet, then it does not change its value.
 *
 * Note: The original object will be changed.
 *
 * @arg {Object} object        - The (sub)-object of the full descriptor
 * @arg {String} property      - The property name
 * @arg {AnyType} defaultValue - The default value of the property
 */
const setDefault = function(object, property, defaultValue) {
    if (!object.hasOwnProperty(property) || object[property] === null) {
        object[property] = defaultValue
    }
}

/**
 * Set default values to a serviceDescriptor object.
 *
 * It adds properties in several places of the descriptor and changes the original object.
 *
 * Note: The original service descriptor object will be changed.
 *
 * @arg {Object} serviceDescriptor - The service descriptor object
 */
const setDefaults = function(serviceDescriptor) {

    setDefault(serviceDescriptor, 'style', 'OPERATION')

    mapOwnProperties(serviceDescriptor.methods, function(method, methodName) {
        let sdMethod = serviceDescriptor.methods[methodName]
        setDefault( sdMethod, 'testCases', [])
        sdMethod.testCases.forEach(function(testCase) {
            setDefault(testCase, 'request', {
                cookies: [],
                headers: []
            })

            setDefault(testCase.request, 'cookies', [])
            setDefault(testCase.request, 'headers', [])

            setDefault(testCase.response, 'headers', [])
            setDefault(testCase.response, 'cookies', [])
        })

        // Set the defaults for the request
        setDefault(sdMethod, 'request', {
            parameters: [],
            cookies: [],
            headers: []
        })

        setDefault(sdMethod.request, 'parameters', [])
        setDefault(sdMethod.request, 'cookies', [])
        setDefault(sdMethod.request, 'headers', [])

        // Set defaults for the responses items
        sdMethod.responses.forEach(function(response) {
            setDefault(response, 'headers', [])
            setDefault(response, 'cookies', [])
        })
    })
}

/**
 * Load service descriptor files
 *
 * @arg {String} restapiRoot -
 * @arg {String} servicesRoot -
 * @arg {Object} servicesToLoad -
 */
const loadServices = function(restapiRoot, servicesRoot, servicesToLoad) {
    const path = require('path')

    const baseFolder = path.resolve(restapiRoot, servicesRoot)

    // serviceFolders
    servicesToLoad.forEach(function (servicePath) {
        let serviceDescriptorFileName = baseFolder + servicePath + '/service.yml'

        // Load the YAML format service descriptor
        // console.log('Loading ' + serviceDescriptorFileName)
        let serviceDescriptor = loadJsonFileSync(serviceDescriptorFileName, true)

        setAliases(serviceDescriptor)

        // Validate the service description
        let err = validate(serviceDescriptor, schemaBasePath, 'serviceSchema.yml')
        if (err.length == 0) {
            setDefaults(serviceDescriptor)
            updateMethodLists(serviceDescriptor)

            // Set service description to services map
            // console.log(serviceDescriptorFileName + 'service is loaded.\n')
            serviceDescriptor.restapiRoot = restapiRoot
            serviceDescriptor.contentPath = servicesRoot + servicePath
            services[serviceDescriptor.uriTemplate] = serviceDescriptor
        } else {
            throw (err)
        }
    })
    return services
}

/**
 * Finds the actual value of the header field
 *
 * @arg {Array} headers - The array of header descriptor objects
 * @arg {String} field  - The header field name
 *
 * @return {String} - The value of the header field
 */
const findHeaderValue = function (headers, field) {
    let content = null
    headers.forEach(function(header) {
        if (header.field.toLowerCase() === field.toLowerCase()) {
            content = header.content
        }
    })
    return content
}

/**
 * Get the mock content body of a service.
 *
 * @param  {Object} serviceDesc  - The service descriptor object
 * @param  {String} mockBodyPath - The filename of the mockBody content.
 * It has to be relative to the directory that holds the service descriptor.
 * @param  {String} contentType  - The service descriptor object.
 * One of: 'text/plain', 'text/html', 'text/xml', 'application/json'.
 * The default content type is 'application/json'.
 *
 * @return {String} - The content of the mock body
 */
const getMockBody = function(serviceDesc, mockBodyPath, contentType) {
    let mockBodyContent = ''

    //console.log('mockBody: ' + mockBody + ' contentType: ' + contentType)
    if (mockBodyPath !== '') {
        mockBodyPath = serviceDesc.restapiRoot + '/' + serviceDesc.contentPath + '/' + mockBodyPath
        if(contentType === 'application/json') {
            mockBodyContent = loadJsonFileSync(mockBodyPath)
        } else {
            if( contentType === 'text/plain' ||
                contentType === 'text/html' ||
                contentType === 'text/xml') {
                //mockBodyContent = loadFile(mockBodyPath, 'utf-8')
                mockBodyContent = loadTextFileSync(mockBodyPath, 'utf-8')
            } else {
                //mockBodyContent = loadFile(mockBodyPath, null)
                mockBodyContent = loadTextFileSync(mockBodyPath, null)
            }
        }
    }
    return mockBodyContent
}

/**
 * Get the request body of a given method of a service.
 *
 * The default content type is 'application/json'.
 *
 * @param  {String} method       The name of the method, such as: GET, PUT, etc
 * @param  {Object} serviceDesc  The service descriptor object
 *
 * @return {String}              The content of the mock body
 */
exports.getMockRequestBody = function(method, serviceDesc) {
    let mockBody = ''
    let contentType = 'application/json'
    let requestMockBody = serviceDesc.methods[method].request.mockBody

    if (typeof requestMockBody != 'undefined' &&
        requestMockBody !== null) {
        mockBody = requestMockBody
        contentType = findHeaderValue(serviceDesc.methods[method].request.headers, 'Content-Type')
    }
    
    return getMockBody(serviceDesc, mockBody, contentType)
}

/**
 * Get the response body of a given method of a service.
 *
 * The default content type is `application/json`.
 *
 * @param  {String} method         - The name of the method, such as GET, PUT, etc.
 * @param  {Object} serviceDesc    - The service descriptor object
 * @param  {Object} nameOfResponse - The name of the response, default: 'OK'
 * @return {String}                - The content of the mock body
 */
exports.getMockResponseBody = function(method, serviceDesc, nameOfResponse) {
    const responseName = nameOfResponse || 'OK'
    let mockBody = ''
    let contentType = 'application/json'

    serviceDesc.methods[method].responses.forEach(function(response) {
        if (response.name === responseName &&
            typeof response.mockBody != 'undefined' &&
            response.mockBody !== null) {
            mockBody = response.mockBody
            contentType = findHeaderValue(response.headers, 'Content-Type')
        }
    })
    
    return getMockBody(serviceDesc, mockBody, contentType)
}

/**
 * Get the services object, that holds the complete set of service descriptors.
 *
 * @return {Object} - The list of services, where the keys of the object are the URI patterns.
 */
exports.getServices = function () {
    return services
}

/**
 * Get all test cases
 *
 * @return {Array} - The array of test case descriptor objects
 */
exports.getAllTestCases = function () {
    let testCases = []

    for (let service in services) {
        if (services.hasOwnProperty(service)) {
            // console.log('get test cases of ' + service)
            let serviceDesc = services[service]
            for (let method in serviceDesc.methods ) {
                if ( serviceDesc.methods.hasOwnProperty(method) ) {
                    let methodDesc = serviceDesc.methods[method]
                    methodDesc.testCases.forEach(function(testCaseDesc) {
                        testCases.push({
                            service: {
                                name: serviceDesc.name,
                                description: serviceDesc.description,
                                uriTemplate: serviceDesc.uriTemplate,
                                urlPattern: serviceDesc.uriTemplate,
                                style: serviceDesc.style
                            },
                            method: method,
                            testCase: {
                                name: testCaseDesc.name,
                                description: testCaseDesc.description,
                                url: testCaseDesc.url,
                                contentPath: serviceDesc.contentPath,
                                template: testCaseDesc.template,
                                request: testCaseDesc.request,
                                response: testCaseDesc.response
                            }
                        })
                    })
                }
            }
        }
    }
    return testCases
}
