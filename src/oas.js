/**
 * A module that loads swagger and OpenAPI 3.0 format API specifications
 * and provides the service endpoint descriptors
 *
 * @module oas
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
 * @return {Promise} A Promise, that resolves to an API descriptor object, that provides inner functions to access to the individual endpoints as well as to the whole loaded model.
 *
 * @function
 * @async
 */
export const loadOas = (oasFile, options = {}) =>
    SwaggerParser.validate(oasFile, options)
        .then(api => {
            return {
                /**
                 * The Original OpenAPI model as it was loaded
                 */
                oasModel: api,

                /**
                 * Return with the original OAS model
                 * @function
                 */
                getOasModel: () => api,

                /**
                 * Get the title of the API
                 * @return {String} - The title of the API
                 * @function
                 */
                getTitle: () => api.info.title,

                /**
                 * Get the version of the API
                 * @return {String} - The version of the API
                 * @function
                 */
                getVersion: () => api.info.version,

                /**
                 * Get all the endpoins defined by the API
                 * @return {Array} - The array of endpoints of the API
                 * @function
                 */
                getEndpoints: () => getEndpoints(api),

                /**
                 * Get the static endpoins defined by the API
                 * @return {Array} - The array of static endpoints of the API
                 * @function
                 */
                getStaticEndpoints: () => getStaticEndpoints(api),

                /**
                 * Get the normal REST endpoins defined by the API
                 * @return {Array} - The array of normal, (non-static, REST) endpoints of the API
                 * @function
                 */
                getNonStaticEndpoints: () => getNonStaticEndpoints(api)
            }
        })
        .catch(err => {
            return Promise.reject(err)
        })

export const getStaticEndpoints = oasApi => _.filter(getEndpoints(oasApi), endpoint => _.has(endpoint, 'static'))
export const getNonStaticEndpoints = oasApi => _.filter(getEndpoints(oasApi), endpoint => !_.has(endpoint, 'static'))

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
        .map(endpoint =>
            _.has(endpoint, 'x-static')
                ? {
                      uri: endpoint.uri,
                      static: endpoint['x-static']
                  }
                : {
                      uri: endpoint.uri,
                      jsfUri: endpoint.jsfUri,
                      method: endpoint.method,
                      operationId: _.get(endpoint, 'operationId', null),
                      consumes: _.get(endpoint, 'consumes', _.get(swaggerApi, 'consumes', [])),
                      produces: _.get(endpoint, 'produces', _.get(swaggerApi, 'produces', []))
                  }
        )
        .value()

export const makeJsonicFriendly = function(uri) {
    return uri.replace(/\{/g, ':').replace(/\}/g, '')
}

export const methodNames = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']

export const getAllOpenApiEndpoints = getAllSwaggerEndpoints // The minimal version returns with the same properties
