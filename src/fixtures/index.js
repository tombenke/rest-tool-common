import { loadJsonFileSync } from 'datafile'
export const v2PetStoreSimpleOasModel = loadJsonFileSync(__dirname + '/oas/v2-petstore-simple-oasmodel.json')
export const v2PetStoreSimpleEndpoints = loadJsonFileSync(__dirname + '/oas/v2-petstore-simple-endpoints.json')
export const v3PetStoreSimpleEndpoints = loadJsonFileSync(__dirname + '/oas/v3-petstore-separate-endpoints.json')
export const v2CombinedStaticEndpoints = loadJsonFileSync(__dirname + '/oas/v2-combined-static-endpoints.json')
export const v2CombinedNonStaticEndpoints = loadJsonFileSync(__dirname + '/oas/v2-combined-nonstatic-endpoints.json')
export const oasBasePath = __dirname + '/oas/'
