#!/usr/bin/env node

/*jshint node: true */
'use strict';

/**
 * JSON schema validator
 * @module schemas
 */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _jayschema = require('jayschema');

var _jayschema2 = _interopRequireDefault(_jayschema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load the YAML parser module
var js = new _jayschema2.default();

/**
 * Load the named JSON schema
 *
 * @arg  {String} schemaFileName - The name of the schema file
 * @return {Object}              - The loaded schema
 */


// Load the JSON schema validator module and create a validator object
var loadSchema = function loadSchema(schemaBasePath, fullSchemaFileName) {
    var scfPath = fullSchemaFileName.split('/');
    var schemaFileName = scfPath[scfPath.length - 1];
    var mainSchema = null;

    // First, register() the main schemas you plan to use.
    try {
        mainSchema = _jsYaml2.default.load(_fs2.default.readFileSync(_path2.default.resolve(schemaBasePath, schemaFileName), 'utf-8'));
        var missingSchemas = js.register(mainSchema);

        // Next, load the missing sub-schemas recursively
        missingSchemas.forEach(function (missingSchema) {
            loadSchema(schemaBasePath, missingSchema);
        });
    } catch (err) {
        //console.log(err)
    }

    return mainSchema;
};

/**
 * Validate the 'content' object with the JSON schema from 'schemaFileName' file
 * @arg  {Object} content        - The object to validate
 * @arg  {String} schemaBasePath - The base path to the directory that contains the schema files
 * @arg  {String} schemaFileName - The name of the schema file to validate by
 * @return {Array}               - The list of errors ([] in case there was no error)
 */
exports.validate = function (content, schemaBasePath, schemaFileName) {
    var schema = loadSchema(schemaBasePath, schemaFileName);

    return js.validate(content, schema);
};