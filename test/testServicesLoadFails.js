#!/usr/bin/env node
/*jshint node: true */
'use strict';

var should = require('should'),
    mocha = require('mocha');
var path = require('path');

describe('Services', function() {

    it('#loadFails()', function(done) {
        var services = require('../index').services;

        if (services.load(path.resolve(__dirname, '/srvcs'), 'services' ) === null ) {
            done();
        } else {
            done('services.load() should not return with non-null value.');
        }
    });
});
