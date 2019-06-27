import _ from 'lodash'
import { loadJsonFileSync } from 'datafile'

export const v2PetStoreSimpleOasModel = loadJsonFileSync(__dirname + '/oas/v2-petstore-simple-oasmodel.json')
export const v2PetStoreSimpleEndpoints = loadJsonFileSync(__dirname + '/oas/v2-petstore-simple-endpoints.json')
export const v3PetStoreSimpleEndpoints = loadJsonFileSync(__dirname + '/oas/v3-petstore-simple-endpoints.json')
export const v2ApiWithExamplesEndpoints = loadJsonFileSync(__dirname + '/oas/v2-api-with-examples-endpoints.json')
export const v3ApiWithExamplesEndpoints = loadJsonFileSync(__dirname + '/oas/v3-api-with-examples-endpoints.json')
export const v2CombinedStaticEndpoints = loadJsonFileSync(__dirname + '/oas/v2-combined-static-endpoints.json')
export const v2CombinedNonStaticEndpoints = loadJsonFileSync(__dirname + '/oas/v2-combined-nonstatic-endpoints.json')
export const oasBasePath = __dirname + '/oas/'

export const removeExamples = endpoints =>
    _.map(endpoints, endpoint => ({
        ...endpoint,
        responses: _.mapValues(endpoint.responses, (v, k, o) => _.omit(v, ['examples']))
    }))

export const oasModels = loadJsonFileSync(__dirname + '/oas/servers.yml')
