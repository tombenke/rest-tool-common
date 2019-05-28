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
 * It also can be a swagger object.
 *
 * @arg {String|Object} oasFile - The path string of the root file of the API specification, or a swagger object.
 * @arg {Object} oasOptions - The options of the loader. See [swagger-parser options](https://apidevtools.org/swagger-parser/docs/options.html) for details.
 * @arg {Object} endpointOptions - The options of the endpoint descriptors. See defaultEndpointOptions for details.
 *
 * @return {Promise} A Promise, that resolves to an API descriptor object, that provides inner functions to access to the individual endpoints as well as to the whole loaded model.
 *
 * @function
 * @async
 */
export const loadOas = (oasFile, oasOptions = {}) =>
    SwaggerParser.validate(oasFile, oasOptions)
        .then(api => {
            const endpointOptions = options =>
                _.merge(
                    {
                        includeExamples: false
                    },
                    options
                )

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
                 * @arg {Object} - The options that control the details of endpoints of the API. Optional. Defaults: `{ includeExamples: false }`.
                 * @return {Array} - The array of endpoints of the API
                 * @function
                 */
                getEndpoints: (options = {}) => getEndpoints(api, endpointOptions(options)),

                /**
                 * Get the static endpoins defined by the API
                 * @arg {Object} - The options that control the details of endpoints of the API. Optional. Defaults: `{ includeExamples: false }`.
                 * @return {Array} - The array of static endpoints of the API
                 * @function
                 */
                getStaticEndpoints: (options = {}) => getStaticEndpoints(api, endpointOptions(options)),

                /**
                 * Get the normal REST endpoins defined by the API
                 * @arg {Object} - The options that control the details of endpoints of the API. Optional. Defaults: `{ includeExamples: false }`.
                 * @return {Array} - The array of normal, (non-static, REST) endpoints of the API
                 * @function
                 */
                getNonStaticEndpoints: (options = {}) => getNonStaticEndpoints(api, endpointOptions(options))
            }
        })
        .catch(err => {
            return Promise.reject(err)
        })

export const getStaticEndpoints = (oasApi, options) =>
    _.filter(getEndpoints(oasApi, options), endpoint => _.has(endpoint, 'static'))
export const getNonStaticEndpoints = (oasApi, options) =>
    _.filter(getEndpoints(oasApi, options), endpoint => !_.has(endpoint, 'static'))

export const getEndpoints = (oasApi, options) =>
    isSwagger(oasApi)
        ? getAllEndpoints(oasApi, swaggerEndpointExtractor(options))
        : isOpenApi(oasApi)
        ? getAllEndpoints(oasApi, openApiEndpointExtractor(options))
        : []

export const isSwagger = oasApi => _.get(oasApi, 'swagger', '').match(/^2\.0.*/)

export const isOpenApi = oasApi => _.get(oasApi, 'openapi', '').match(/^3\.0.*/)

export const getAllEndpoints = (swaggerApi, responseExtractor) =>
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
                ? makeStaticEndpoint(swaggerApi, endpoint, responseExtractor)
                : makeOperationEndpoint(swaggerApi, endpoint, responseExtractor)
        )
        .value()

export const makeStaticEndpoint = (swaggerApi, endpoint) => ({
    uri: endpoint.uri,
    static: endpoint['x-static']
})

export const makeOperationEndpoint = (api, endpoint, responseExtractor) => ({
    uri: endpoint.uri,
    jsfUri: endpoint.jsfUri,
    method: endpoint.method,
    operationId: _.get(endpoint, 'operationId', null),
    consumes: _.get(endpoint, 'consumes', _.get(api, 'consumes', [])),
    produces: _.get(endpoint, 'produces', _.get(api, 'produces', [])),
    responses: responseExtractor(api, endpoint)
})

export const makeJsonicFriendly = uri => uri.replace(/\{/g, ':').replace(/\}/g, '')

export const methodNames = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']

export const swaggerEndpointExtractor = options => (api, endpoint) =>
    _.chain(
        _.values(
            _.mapValues(endpoint.responses, (v, k, o) => ({
                status: k,
                headers: _.get(v, 'headers', {}),
                examples: _.mapValues(_.get(v, 'examples', {}), (v, k, o) => ({ noname: { mimeType: k, value: v } }))
            }))
        )
            .map(endpoint => (options.includeExamples ? endpoint : _.omit(endpoint, ['examples'])))
            .reduce((accu, v, k) => {
                accu[v.status] = v
                return accu
            }, {})
    ).value()

export const openApiEndpointExtractor = options => (api, endpoint) =>
    _.chain(
        _.values(
            _.mapValues(endpoint.responses, (v, k, o) => ({
                status: k,
                headers: _.get(v, 'headers', {}),
                examples: getExamplesFromV3Content(_.get(v, 'content', {}))
            }))
        )
            .map(endpoint => (options.includeExamples ? endpoint : _.omit(endpoint, ['examples'])))
            .reduce((accu, v, k) => {
                accu[v.status] = v
                return accu
            }, {})
    ).value()

export const getExamplesFromV3Content = (content, mimeType) =>
    _.mapValues(content, (mimeTypeValue, mimeType, mto) =>
        _.has(mimeTypeValue, 'example')
            ? { noname: { mimeType: mimeType, value: mimeTypeValue.example } } // Return with example
            : _.has(mimeTypeValue, 'examples')
            ? _.mapValues(mimeTypeValue.examples, (v, k, o) => ({
                  // Return with examples
                  mimeType: mimeType,
                  value: _.has(v, 'externalValue') ? v.externalValue : _.get(v, 'value', null)
              }))
            : {}
    ) // Neither examples nor example are defined
