#!/usr/bin/env node
/*jshint node: true */
'use strict';

var should = require('should'),
    mocha = require('mocha');
var path = require('path');

describe('Services', function() {

    it('#load()', function(done) {
        var services = require('../index').services;

        if (services.load(path.resolve(__dirname, 'fixtures'), 'services') === null) {
            done('ERROR: services.load unsuccessful.');
        } else {
            done();
        }
    });
});
