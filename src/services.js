#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * A module that loads and provides the service endpoint descriptors
 *
 * @module services
 */

const schemas = require('./schemas/')
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
 * Load content identified by 'contentFileName' with the selected 'encoding'.
 *
 * Mainly used to load mock bodies from files.
 *
 * @arg  {String} contentFileName - The path to the content file
 * @arg  {String} encoding        - The encoding of the content file
 * @arg {Buffer}                  - The content
 */
const loadFile = function (contentFileName, encoding) {
    const fs = require('fs')
    // console.log('loadFile:' + contentFileName)
    return(fs.readFileSync(contentFileName, encoding))
}

/** Load JSON format content from file.
 *
 * @arg {String} contentFileName - The path to the file which holds the content to load in.
 *
 * @return {Object} The content of the loaded file as a JSON object.
 *
 * @throws Throws an error if there is a problem with loading the file.
 */
const loadJsonFile = function (contentFileName) {
    let content = null

    try {
        content = require(contentFileName)
    } catch (error) {
        //console.log(error)
    }
    return content
}

/**
 * Load services config file, and validates with the serviceConfigSchema.yml validator.
 *
 * @arg {String} configFileName - The path of the service config file
 *
 * @return {Object} - in case of success, return with the configuration object, in case of validation error return with `null` and writes error messages to console.
 */
const loadConfig = function(configFileName) {

    let config = loadJsonFile(configFileName)
    if (config !== null) {
        let err = schemas.validate(config, schemaBasePath, 'serviceConfigSchema.yml')

        if (err.length > 0) {
            console.log('\nERROR: In config file: ' + configFileName)
            return null
        }
    }

    return config
}

/**
 * Load all service descriptors
 *
 * @arg {String} restapiRoot  - The path to the main config file of the services named: `config.yml`.
 * @arg {String} servicesRoot - The path to the root folder where the service descriptors are placed.
 *
 * @return {Object} - The Object, which holds all service descriptors, using the URI patterns as keys.
 * in case of error returns with `null`.
 */
exports.load = function(restapiRoot, servicesRoot) {
    const path = require( 'path' )

    const config = loadConfig(path.resolve(restapiRoot, 'config.yml'))
    if (config === null) {
        return null
    }

    //const baseFolder = path.resolve(restapiRoot, servicesRoot),
    let servicesToLoad = config.services

    // console.log('load(%s,%s)', restapiRoot, servicesRoot)
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
 */
const updateMethodLists = function (serviceDescriptor) {
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
    const path = require('path' )

    const baseFolder = path.resolve(restapiRoot, servicesRoot)
    // console.log('loadServices from ', baseFolder)

    // serviceFolders
    servicesToLoad.forEach(function (servicePath) {
        let serviceDescriptorFileName = baseFolder + servicePath + '/service.yml'

        // Load the YAML format service descriptor
        // console.log('Loading ' + serviceDescriptorFileName)
        let serviceDescriptor = require( serviceDescriptorFileName )

        setAliases(serviceDescriptor)

        // Validate the service description
        let err = schemas.validate(serviceDescriptor, schemaBasePath, 'serviceSchema.yml')
        if (err.length == 0 ) {
            setDefaults(serviceDescriptor)
            updateMethodLists(serviceDescriptor)

            // Set service description to services map
            // console.log(serviceDescriptorFileName + 'service is loaded.\n')
            serviceDescriptor.restapiRoot = restapiRoot
            serviceDescriptor.contentPath = servicesRoot + servicePath
            services[serviceDescriptor.uriTemplate] = serviceDescriptor
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
            mockBodyContent = loadJsonFile(mockBodyPath)
        } else {
            if( contentType === 'text/plain' ||
                contentType === 'text/html' ||
                contentType === 'text/xml') {
                mockBodyContent = loadFile(mockBodyPath, 'utf-8')
            } else {
                mockBodyContent = loadFile(mockBodyPath, null)
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
