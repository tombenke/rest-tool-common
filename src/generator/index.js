#!/usr/bin/env node
/*jshint node: true */
'use strict';

/**
 * Universal generator module to create directories files and template based contents
 *
 * @module generator
 */

import merge from 'lodash'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import wrench from 'wrench'

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

const loadTextFileSync = function(fileName, raiseErrors=true) {
	let content = null

    if (fileName) {
        try {
            content = fs.readFileSync(path.resolve(fileName), { encoding: 'utf8' })
        } catch (err) {
            if (raiseErrors) {
                throw(err)
            }
        }
    } else {
        if (raiseErrors) {
            throw(new Error('File name is missing!'))
        }
    }
    return content
}

const saveTextFileSync = function(fileName, content, raiseErrors=true) {

    if (fileName) {
        try {
            fs.writeFileSync(path.resolve(fileName), content, { encoding: 'utf8' })
        } catch (err) {
            if (raiseErrors) {
                throw(err)
            }
        }
    } else {
        if (raiseErrors) {
            throw(new Error('File name is missing!'))
        }
    }
}

exports.processTemplate = function(context, opts) {
    const templateFileName = path.resolve(opts.sourceBaseDir, opts.template)
    const resultFileName = path.resolve(opts.targetBaseDir, opts.template)
    const view = merge({}, context)
    const rawTemplate = loadTextFileSync(templateFileName)

    console.log('templateFileName: ' + templateFileName)
    console.log('resultFileName: ' + resultFileName)
    console.log(view, rawTemplate)

    const template = handlebars.compile(rawTemplate)
    const outputContent = template(context)
    console.log(outputContent)
    saveTextFileSync(resultFileName, outputContent)
}
