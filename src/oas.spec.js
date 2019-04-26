import path from 'path'
import should from 'should'
import { loadOas } from './oas'
import { oasBasePath, v2PetStoreSimpleEndpoints, v3PetStoreSimpleEndpoints } from './fixtures/'

const oasConfig = {
    parse: {
        yaml: {
            allowEmpty: false // Don't allow empty YAML files
        },
        resolve: {
            file: true // Resolve local file references
        }
    }
}

describe('oas', () => {
    it('#loadOas()', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml')
        loadOas(oasFile, oasConfig).then(res => done())
    })

    it('#getAllEndpoints - from v2.0', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/yaml/petstore-simple.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const endpoints = api.getEndpoints()
            endpoints.should.be.eql(v2PetStoreSimpleEndpoints)
            done()
        })
    })

    it('#getAllEndpoints - from v3.0', done => {
        const oasFile = path.resolve(oasBasePath, 'v3.0/petstore-expanded.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const endpoints = api.getEndpoints()
            endpoints.should.be.eql(v3PetStoreSimpleEndpoints)
            done()
        })
    })
})
