#!/usr/bin/env node
/*jshint node: true */
'use strict';

var should = require('should'),
    mocha = require('mocha');

describe('Services', function() {

    it('#load()', function(done) {
        var services = require('../lib/services.js');

        if (services.load(__dirname + '/services' ) === null ) {
            done('ERROR: services.load unsuccessful.');
        } else {
            done();
        }
    });
});