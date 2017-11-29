#!/usr/bin/env node
/*jshint node: true */
'use strict';

const path = require('path')
const should = require('should')

describe('services', function() {

    it('#testNoTestCases()', function(done) {
        const services = require('./index').services

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
})
