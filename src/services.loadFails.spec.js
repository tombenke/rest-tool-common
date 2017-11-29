#!/usr/bin/env node
/*jshint node: true */
'use strict';

const should = require('should')
const path = require('path')

describe('services', function() {

    it('#loadFails()', function(done) {
        const services = require('./index').services

        if (services.load(path.resolve(__dirname, '/srvcs'), 'services' ) === null ) {
            done()
        }
    })
})
