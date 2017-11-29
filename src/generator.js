#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * Generator module for the rest-tool-common library
 * @module generator
 */

import extend from 'lodash'

const mu = require('mu2')
const fs = require('fs')
const path = require('path')
const wrench = require('wrench')
let verbose = true

exports.createDirectoryTree = function(rootDirName, projectTree, removeIfExist) {
    let rootDirPath = path.resolve(rootDirName)

    if (fs.existsSync(rootDirPath)) {
        console.log( "ERROR: Directory exists yet! " + rootDirPath)
        if( ! removeIfExist ) {
            return false
        }
        console.log('Remove existing directory...')
        wrench.rmdirSyncRecursive(rootDirPath)
    }

    wrench.mkdirSyncRecursive(rootDirPath)
    projectTree.forEach( function(dir) {
        var dirToCreate = path.resolve( path.join( rootDirName, dir))
        if (verbose) console.log('Create "' + dirToCreate + '"')
        fs.mkdirSync(dirToCreate)
    })
    return true
}

exports.copyDir = function(context, opts) {
    let sourceDirName = path.resolve(opts.sourceBaseDir, opts.dirName)
    let destDirName = path.resolve(opts.targetBaseDir, opts.dirName)

    if (verbose) console.log('Copy dir from: ' + sourceDirName + ' to: ' + destDirName)
    wrench.copyDirSyncRecursive(sourceDirName, destDirName, opts)
}

exports.copyFile = function(fileName, sourceBaseDir, targetBaseDir, context) {
        console.log('copyFile...' + fileName)

    let sourceFileName = path.resolve(sourceBaseDir, fileName)
    let destFileName = path.resolve(targetBaseDir, fileName)

    if (verbose) console.log('Copy file from: ' + sourceFileName + ' to: ' + destFileName)
    fs.writeFileSync(destFileName, fs.readFileSync(sourceFileName))
}

exports.processTemplate = function(context, opts) {
    let templateFileName = path.resolve(opts.sourceBaseDir, opts.template)
    let fileName = path.resolve(opts.targetBaseDir, opts.template)
    let buffer = ''
    let view = {}

    if (verbose) console.log('templateFileName: ' + templateFileName)
    if (verbose) console.log('fileName: ' + fileName)

    extend(view, context)

    mu.compileAndRender(templateFileName, view)
        .on('data', function(c) {
            buffer += c.toString()
        })
        .on('end', function() {
            fs.writeFile(fileName, buffer, function(err) {
                if (err) throw err
            })
        })
}
