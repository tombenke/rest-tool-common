#!/usr/bin/env node
/*jshint node: true */
'use strict';

import should from 'should'
import * as generator from './index'

describe('generator', function() {

    it('#createDirectoryTree() - Do not overwrite existing content', function(done) {
        should(generator.createDirectoryTree('src/generator/fixtures/target/toNotOverwrite/', [
                "services",
                "services/monitoring",
                "services/monitoring/isAlive"
            ], false)).be.equal(false)
        done()
    })

    it('#createDirectoryTree() - Overwrite existing content', function(done) {
        // First it creates the non-existing tree
        should(generator.createDirectoryTree('tmp/generator/target/toOverwrite/', [
                "services",
                "services/monitoring",
                "services/monitoring/isAlive"
            ], true)).be.equal(true)

        // Then overwrites the previously created tree
        should(generator.createDirectoryTree('tmp/generator/target/toOverwrite/', [
                "services",
                "services/monitoring",
                "services/monitoring/isAlive"
            ], true)).be.equal(true)
        done()
    })

    it('#copyDir() - ', function(done) {
        done()
    })

    it('#copyFile() - ', function(done) {
        done()
    })

    it('#processTemplate() - ', function(done) {
        done()
    })
})
