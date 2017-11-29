#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * JSON schema validator
 * @module schemas
 */

import fs from 'fs'
import path from 'path'

// Load the YAML parser module
import jsyaml from 'js-yaml'

// Load the JSON schema validator module and create a validator object
import JaySchema from 'jayschema'
const js = new JaySchema()

/**
 * Load the named JSON schema
 *
 * @arg  {String} schemaFileName - The name of the schema file
 * @return {Object}              - The loaded schema
 */
const loadSchema = function(schemaBasePath, fullSchemaFileName) {
    const scfPath = fullSchemaFileName.split('/')
    const schemaFileName = scfPath[scfPath.length - 1]
    let mainSchema = null

    // First, register() the main schemas you plan to use.
    try {
        mainSchema = jsyaml.load(fs.readFileSync(path.resolve(schemaBasePath, schemaFileName), 'utf-8'))
        const missingSchemas = js.register(mainSchema)

        // Next, load the missing sub-schemas recursively
        missingSchemas.forEach(function(missingSchema) {
            loadSchema(schemaBasePath, missingSchema)
        })

    } catch (err) {
        //console.log(err)
    }

    return mainSchema
}

/**
 * Validate the 'content' object with the JSON schema from 'schemaFileName' file
 * @arg  {Object} content        - The object to validate
 * @arg  {String} schemaBasePath - The base path to the directory that contains the schema files
 * @arg  {String} schemaFileName - The name of the schema file to validate by
 * @return {Array}               - The list of errors ([] in case there was no error)
 */
exports.validate = function(content, schemaBasePath, schemaFileName) {
    const schema = loadSchema(schemaBasePath, schemaFileName)

    return js.validate(content, schema)
}
