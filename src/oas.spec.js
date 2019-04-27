import path from 'path'
import should from 'should'
import { loadOas } from './oas'
import {
    oasBasePath,
    v2CombinedStaticEndpoints,
    v2CombinedNonStaticEndpoints,
    v2PetStoreSimpleEndpoints,
    v3PetStoreSimpleEndpoints
} from './fixtures/'

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

    it('#getEndpoints - from v2.0', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/yaml/petstore-simple.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const endpoints = api.getEndpoints()
            endpoints.should.be.eql(v2PetStoreSimpleEndpoints)
            done()
        })
    })

    it('#getEndpoints - from v3.0', done => {
        const oasFile = path.resolve(oasBasePath, 'v3.0/petstore-expanded.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const endpoints = api.getEndpoints()
            endpoints.should.be.eql(v3PetStoreSimpleEndpoints)
            done()
        })
    })

    it('#getStaticEndpoints() - from combined', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/combined/api.yml')
        loadOas(oasFile, oasConfig).then(api => {
            const staticEndpoints = api.getStaticEndpoints()
            console.log(JSON.stringify(staticEndpoints, null, 2))
            staticEndpoints.should.be.eql(v2CombinedStaticEndpoints)
            const nonStaticEndpoints = api.getNonStaticEndpoints()
            console.log(JSON.stringify(nonStaticEndpoints, null, 2))
            nonStaticEndpoints.should.be.eql(v2CombinedNonStaticEndpoints)
            done()
        })
    })

})
