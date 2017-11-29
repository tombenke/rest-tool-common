#!/usr/bin/env node
/*jshint node: true */
'use strict';

const should = require('should')
const path = require('path')

describe('services', function() {

    it('#getMockRequestBody()', function(done) {
        var services = require('./index').services
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
        var services = require('./index').services

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            var allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            services.getMockResponseBody('GET', allServices['/monitoring/isAlive'], 'OK').should.be.equal("The service is alive\n")
            done()
        }
    })

})
