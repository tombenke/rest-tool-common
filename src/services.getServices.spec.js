#!/usr/bin/env node
/*jshint node: true */
'use strict';

const should = require('should')
const schemas = require('./schemas/')
const path = require('path')

describe('services', function() {
    const schemaBasePath = __dirname + '/../schemas/'

    it('#getServices()', function(done) {
        var services = require('./index').services

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') != null) {
            let allServices = services.getServices()
            allServices.should.be.instanceof(Object)
            let validationErrors = 0

            for (let s in allServices) {
                let service = allServices[s]
                let errors = schemas.validate(service, schemaBasePath, 'serviceSchema.yml')
                validationErrors += errors.length
            }
            if (validationErrors === 0) {
                done()
            }
        }
    })
})
