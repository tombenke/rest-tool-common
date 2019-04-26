import _ from 'lodash'
import SwaggerParser from 'swagger-parser'

export const loadOas = (oasFile, options = {}) =>
    SwaggerParser.validate(oasFile, options)
        .then(api => {
            //console.log(JSON.stringify(api, null, 2))
            return {
                oasModel: api,
                getOasModel: () => api,
                getTitle: () => api.info.title,
                getVersion: () => api.info.version,
                getEndpoints: () => getEndpoints(api)
            }
        })
        .catch(err => {
            console.log(err)
            return Promise.reject(err)
        })

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
        .map(endpoint => ({
            uri: endpoint.uri,
            jsfUri: endpoint.jsfUri,
            method: endpoint.method,
            operationId: endpoint.operationId,
            consumes: _.get(endpoint, 'consumes', _.get(swaggerApi, 'consumes', [])),
            produces: _.get(endpoint, 'produces', _.get(swaggerApi, 'produces', []))
        }))
        .value()

export const makeJsonicFriendly = function(uri) {
    return uri.replace(/\{/g, ':').replace(/\}/g, '')
}

export const methodNames = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch']

export const getAllOpenApiEndpoints = getAllSwaggerEndpoints // The minimal version returns with the same properties
