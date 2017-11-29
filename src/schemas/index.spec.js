#!/usr/bin/env node
/*jshint node: true */
'use strict';

import should from 'should'
import schemas from './index'
import {
    loadDataFileSync,
    mergeDataFilesSync,
    listFilesSync,
    findFilesSync,
    mergeDataFilesByKeySync,
    loadData // alias mergeDataFilesSync, DEPRECATED
} from 'datafile'

describe('schemas', function() {

    it('#validate() - use single schema file', function(done) {
        const dataToValidate = loadDataFileSync('src/schemas/fixtures/earth.yml')
        if (schemas.validate(dataToValidate, __dirname + '/fixtures/', 'planetSchema.yml').length === 0) {
            done()
        }
    })

    it('#validate() - use complex schema files', function(done) {
        const dataToValidate = loadDataFileSync('src/schemas/fixtures/solarSystem.yml')
        console.log(dataToValidate)
        const err = schemas.validate(dataToValidate, __dirname + '/fixtures/', 'solarSystemSchema.yml')
        if (err.length === 0) {
            done()
        }
    })

    it('#validate() - find validation error', function(done) {
        const dataToValidate = loadDataFileSync('src/schemas/fixtures/invalidPlanet.yml')
        const errors = schemas.validate(dataToValidate, __dirname + '/fixtures/', 'planetSchema.yml')
        if (errors.length > 0) {
            errors.length.should.equal(1)
            errors[0].kind.should.equal('ObjectValidationError')
            errors[0].desc.should.equal('missing: earthMass,moons')
            done()
        }
    })

    it('#validate() - missing schema error', function(done) {
        const dataToValidate = loadDataFileSync('src/schemas/fixtures/earth.yml')
        const errors = schemas.validate(dataToValidate, __dirname + '/fixtures/', 'missingSchema.yml')
        if (errors.length > 0) {
            errors[0].desc.should.equal('No schema provided for validation.')
            done()
        }
    })
})
