#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * JSON schema validator for the restapi tool
 */

var fs = require('fs');

// Load the YAML parser module
var jsyaml = require( 'js-yaml' );

// Load the JSON schema validator module and create a validator object
var JaySchema = require('jayschema');
var js = new JaySchema();

// var schemaLoader = function(ref, callback) {
//     console.log('Loader called with: ', ref);
//     // ref is the schema to load
//     // [ load your schema! ]
//     var schema = jsyaml.load(fs.readFileSync('schemas/' + ref,'utf-8'));
//     if (schema) {
//         callback(schema);
//     } else {      
//         callback(null, schema);
//     }
// };

/**
 * Load the named JSON schema
 * @param  {String} schemaFileName The name of the schema file
 * @return {Object}                The loaded schema
 */
var loadSchema = function(fullSchemaFileName) {
    // console.log('loading schema: ', fullSchemaFileName);
    var scfPath = fullSchemaFileName.split('/');
    var schemaFileName = scfPath[scfPath.length-1];

    // First, register() the main schemas you plan to use.
    var mainSchema = jsyaml.load(fs.readFileSync(__dirname + '/../schemas/' + schemaFileName,'utf-8'));
    var missingSchemas = js.register(mainSchema);

    // console.log( 'Register schema: ' + fullSchemaFileName, missingSchemas);

    // Next, load the missing sub-schemas recursively
    missingSchemas.forEach(function(missingSchema) {
        console.log('Missing sub-schema will be loaded: ', missingSchema);
        loadSchema(missingSchema);
    });

    return mainSchema;
};

/**
 * Validate the 'content' object with the JSON schema from 'schemaFileName' file
 * @param  {Object} content        The object to validate
 * @param  {String} schemaFileName The name of the schema file
 * @return {Array}                 The list of errors ([] in case there was no error)
 */
exports.validate = function(content, schemaFileName) {
    // console.log('validate', schemaFileName);
    var schema = loadSchema(schemaFileName);
    var err = js.validate(content, schema);

    if (err.length > 0 ) {
        console.log('\nValidation error:');
        err.forEach(function(error) {
            console.log(error.desc);
        });
        return err;
    } else {
        return [];
    }
};
