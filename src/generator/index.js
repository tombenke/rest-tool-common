#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * Universal generator module to create directories files and template based contents
 *
 * @module generator
 */

import * as _ from 'lodash'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import wrench from 'wrench'

import { loadTextFileSync, saveTextFileSync } from 'datafile'

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
        console.log('Create "' + dirToCreate + '"')
        fs.mkdirSync(dirToCreate)
    })
    return true
}

exports.copyDir = function(context, opts) {
    let sourceDirName = path.resolve(opts.sourceBaseDir, opts.dirName)
    let destDirName = path.resolve(opts.targetBaseDir, opts.dirName)

    console.log('Copy dir from: ' + sourceDirName + ' to: ' + destDirName)
    wrench.copyDirSyncRecursive(sourceDirName, destDirName, opts)
}

exports.copyFile = function(fileName, sourceBaseDir, targetBaseDir, context) {
    console.log('copyFile...' + fileName)

    let sourceFileName = path.resolve(sourceBaseDir, fileName)
    let destFileName = path.resolve(targetBaseDir, fileName)

    console.log('Copy file from: ' + sourceFileName + ' to: ' + destFileName)
    fs.writeFileSync(destFileName, fs.readFileSync(sourceFileName))
}

exports.processTemplate = function(context, opts) {
    const templateFileName = path.resolve(opts.sourceBaseDir, opts.template)
    const resultFileName = path.resolve(opts.targetBaseDir, opts.template)
    const view = _.merge({}, context)
    const rawTemplate = loadTextFileSync(templateFileName)

    console.log('templateFileName: ' + templateFileName)
    console.log('resultFileName: ' + resultFileName)
    console.log('view: ', view)
    console.log('rawTemplate: ', rawTemplate)

    handlebars.registerPartial({
        "header.html": "<p>This is a header</p>\n",
        "footer.html": "<p>This is a footer with copyright: {{> copyright.html}}</p>\n",
        "copyright.html": "(c) 2017 - {{projectName}}"
    })

    let template = handlebars.compile(rawTemplate)
    console.log('template: ', template)
    let outputContent = template(view)
    console.log('outputContent: ', outputContent)
    saveTextFileSync(resultFileName, outputContent)
}
