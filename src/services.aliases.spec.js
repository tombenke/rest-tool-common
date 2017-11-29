#!/usr/bin/env node
/*jshint node: true */
'use strict';

const should = require('should')
const path = require('path')

describe('services', function() {

    it('#testAliases()', function(done) {
        const services = require('./index').services

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
