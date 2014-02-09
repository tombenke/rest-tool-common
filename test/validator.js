/*jshint node: true */
'use strict';

(function() {
    var should = require('should');

    exports.Validator = function() {

        var validator = {
            /**
             * Validate the method property of a service
             * @param  {String} method   The method string to validate
             * @return {Boolean}         true if successfully validated, false otherwise
             */
            method : function (method) {
                method.should.match(/GET|PUT|POST|DELETE/);
                return true;
            },

            /**
             * Validate the service object
             * @param  {Object} service  The service object to validate
             * @return {Boolean}         true if successfully validated, false otherwise
             */
            testCaseService : function (service) {
                service.should.be.instanceof(Object);
                service.should.have.property('name');
                service.should.have.property('description');
                service.should.have.property('urlPattern');
                service.should.have.property('style');
                service.style.should.match(/OPERATION|RESOURCE/);
                return true;
            },

            /**
             * Validate the request object of a testCase object
             * @param  {Object} request   The request object to validate
             * @return {Boolean}          true if successfully validated, false otherwise
             */
            testCaseRequest : function (request) {
                request.should.have.property('cookies');
                request.cookies.should.be.instanceof(Array);
                request.should.have.property('headers');
                request.headers.should.be.instanceof(Array);
                return true;
            },

            /**
             * Validate the response object of a testCase object
             * @param  {Object} response  The response object to validate
             * @return {Boolean}          true if successfully validated, false otherwise
             */
            testCaseResponse : function (response) {
                response.should.have.property('cookies');
                response.cookies.should.be.instanceof(Array);
                response.should.have.property('headers');
                response.headers.should.be.instanceof(Array);
                response.should.have.property('statusCode');
                // console.log(typeof response.statusCode);
                // response.statusCode.should.be.instanceof(Number);

                return true;
            },

            /**
             * Validate the testCase object
             * @param  {Object} testCase  The testCase object to validate
             * @return {Boolean}          true if successfully validated, false otherwise
             */
            testCase : function (testCase) {
                // Validate service
                testCase.should.have.property('service');
                validator.testCaseService(testCase.service);

                // Validate method
                testCase.should.have.property('method');
                validator.method(testCase.method);

                // Validate testCase
                testCase.should.have.property('testCase');
                testCase.testCase.should.be.instanceof(Object);
                testCase.testCase.should.have.property('name');
                testCase.testCase.should.have.property('description');
                testCase.testCase.should.have.property('url');
                testCase.testCase.should.have.property('contentPath');
                testCase.testCase.should.have.property('template');
                testCase.testCase.should.have.property('request');
                testCase.testCase.should.have.property('response');

                // Validate the internals of request and response
                testCase.testCase.request.should.be.instanceof(Object);
                validator.testCaseRequest(testCase.testCase.request);

                testCase.testCase.response.should.be.instanceof(Object);
                validator.testCaseResponse(testCase.testCase.response);

                return true;
            }
        };

        return validator;
    };
})();