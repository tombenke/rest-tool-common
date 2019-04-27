/**
 * A module that loads swagger and OpenAPI 3.0 format API specifications
 * and provides the service endpoint descriptors
 *
 * @module services
 */

import _ from 'lodash'
import SwaggerParser from 'swagger-parser'

/**
 * Load swagger and/or OpenAPI specification
 * The specification can be a single file, or that can made of several partials.
 *
 * @arg {String} oasFile - The path of the root file of the API specification.
 * @arg {Object} options - The options of the loader. See [swagger-parser options](https://apidevtools.org/swagger-parser/docs/options.html) for details.
 *
 * @return {Promise} A Promise, that resolves to an endpoints object, that provides functions to access to the individual endpoints as well as to the whole loaded model.
 *
 * @function
 */
export const loadOas = (oasFile, options = {}) =>
    SwaggerParser.validate(oasFile, options)
        .then(api => {
            return {
                oasModel: api,
                getOasModel: () => api,
                getTitle: () => api.info.title,
                getVersion: () => api.info.version,
                getEndpoints: () => getEndpoints(api),
                getStaticEndpoints: () => getStaticEndpoints(api),
                getNonStaticEndpoints: () => getNonStaticEndpoints(api)
            }
        })
        .catch(err => {
            console.log(err)
            return Promise.reject(err)
        })

export const getStaticEndpoints = oasApi => _.filter(getEndpoints(oasApi), endpoint => _.has(endpoint, 'static'))
export const getNonStaticEndpoints = oasApi => _.filter(getEndpoints(oasApi), endpoint => ! _.has(endpoint, 'static'))

export const getEndpoints = oasApi =>
    isSwagger(oasApi) ? getAllSwaggerEndpoints(oasApi) : isOpenApi(oasApi) ? getAllOpenApiEndpoints(oasApi) : []

export const isSwagger = oasApi => _.get(oasApi, 'swagger', '').match(/^2\.0.*/)

export const isOpenApi = oasApi => _.get(oasApi, 'openapi', '').match(/^3\.0.*/)

export const getAllSwaggerEndpoints = swaggerApi =>
    _.chain(
        // Get all paths as a list, including the path value as an 'uri' property
        _.values(
            _.mapValues(swaggerApi.paths, (v, k, o) => ({
                uri: k,
                ...v
            }))
        )
    )
        .flatMap(path =>
            _.flatMap(methodNames, methodName =>
                _.get(path, methodName, null)
                    ? [
                          {
                              uri: path.uri,
                              jsfUri: makeJsonicFriendly(path.uri),
                              method: methodName,
                              ...path[methodName]
                          }
                      ]
                    : []
            )
        )
        .map(endpoint => (_.has(endpoint, 'x-static') ? {
            uri: endpoint.uri,
            static: endpoint['x-static']
        } : {
            uri: endpoint.uri,
            jsfUri: endpoint.jsfUri,
            method: endpoint.method,
            operationId: _.get(endpoint, 'operationId', null),
            consumes: _.get(endpoint, 'consumes', _.get(swaggerApi, 'consumes', [])),
            produces: _.get(endpoint, 'produces', _.get(swaggerApi, 'produces', []))
        }))
        .value()

export const makeJsonicFriendly = function(uri) {
    return uri.replace(/\{/g, ':').replace(/\}/g, '')
}

export const methodNames = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']

export const getAllOpenApiEndpoints = getAllSwaggerEndpoints // The minimal version returns with the same properties
