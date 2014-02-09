var should = require('should'),
    mocha = require('mocha');

describe('Services', function() {

    it('#load()', function(done) {
        var services = require('../lib/services.js');

        services.load(__dirname + '/services' );

        done();
    });
});