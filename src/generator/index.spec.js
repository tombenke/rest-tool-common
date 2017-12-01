#!/usr/bin/env node
/*jshint node: true */
'use strict';

import rimraf from 'rimraf'
import path from 'path'
import should from 'should'
import * as generator from './index'

const destCleanup = function(cb) {
    const dest = path.resolve('./tmp/')
    rimraf(dest, cb)
}

before(function(done) {
    destCleanup(done)
})

after(function(done) {
    destCleanup(done)
//    done()
})

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
        const context = {
            projectName: "rest-tool-common",
            itemsToList: [{
                uri: 'http://www.google.com',
                name: 'Google'
            }, {
                uri: 'http://www.amazon.com',
                name: 'Amazon'
            }, {
                uri: 'http://www.heroku.com',
                name: 'Heroku'
            }]
        }

        generator.processTemplate(context, {
            sourceBaseDir: 'src/generator/fixtures/templates/',
            targetBaseDir: 'tmp/',
            template: 'main.html'
        })
        done()
    })
})
