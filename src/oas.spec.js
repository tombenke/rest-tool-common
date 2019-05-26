import path from 'path'
import should from 'should'
import { loadOas } from './oas'
import {
    oasBasePath,
    v2CombinedStaticEndpoints,
    v2CombinedNonStaticEndpoints,
    v2PetStoreSimpleEndpoints,
    v2PetStoreSimpleOasModel,
    v3PetStoreSimpleEndpoints,
    v2ApiWithExamplesEndpoints,
    v3ApiWithExamplesEndpoints
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
    it('#loadOas() - from file', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml')
        loadOas(oasFile, oasConfig).then(res => done())
    })

    it('#loadOas() - from swagger object', done => {
        loadOas(v2PetStoreSimpleOasModel, oasConfig).then(api => {
            const oasModel = api.getOasModel()
            oasModel.should.be.eql(v2PetStoreSimpleOasModel)
            done()
        })
    })

    it('#loadOas() - fails', done => {
        const oasFile = path.resolve(oasBasePath, 'non-existing-api-file')
        loadOas(oasFile, oasConfig).catch(res => done())
    })

    it('#getOasModel', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const oasModel = api.getOasModel()
            oasModel.should.be.eql(v2PetStoreSimpleOasModel)
            done()
        })
    })

    it('#getVersion', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const apiVersion = api.getVersion()
            apiVersion.should.be.equal('1.0.0')
            done()
        })
    })

    it('#getTitle', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/yaml/petstore-separate/spec/swagger.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const apiTitle = api.getTitle()
            apiTitle.should.be.equal('Swagger Petstore')
            done()
        })
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
            staticEndpoints.should.be.eql(v2CombinedStaticEndpoints)
            done()
        })
    })

    it('#getNonStaticEndpoints() - from combined', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/combined/api.yml')
        loadOas(oasFile, oasConfig).then(api => {
            const nonStaticEndpoints = api.getNonStaticEndpoints()
            nonStaticEndpoints.should.be.eql(v2CombinedNonStaticEndpoints)
            done()
        })
    })

    it('#getEndpoints - from v2.0 with examples', done => {
        const oasFile = path.resolve(oasBasePath, 'v2.0/yaml/api-with-examples.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const endpoints = api.getEndpoints()
            endpoints.should.be.eql(v2ApiWithExamplesEndpoints)
            done()
        })
    })

    it('#getEndpoints - from v3.0 with examples', done => {
        const oasFile = path.resolve(oasBasePath, 'v3.0/api-with-examples.yaml')
        loadOas(oasFile, oasConfig).then(api => {
            const endpoints = api.getEndpoints()
            endpoints.should.be.eql(v3ApiWithExamplesEndpoints)
            done()
        })
    })
})
