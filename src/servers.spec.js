import should from 'should'
import { getSwaggerServers, getOpenApiServers } from './servers'
import { oasModels } from './fixtures/'

describe('servers', () => {
    const testGetSwaggerServers = (testCase) => {
        const oasModel = testCase.config
        const expected = testCase.expected

        const servers = getSwaggerServers(oasModel)
        servers.should.be.eql(expected)
        return
    }

    const testGetOpenApiServers = (testCase) => {
        const oasModel = testCase.config
        const expected = testCase.expected

        const servers = getOpenApiServers(oasModel)
        servers.should.be.eql(expected)
        return
    }

    it('#getSwaggerServers - none', (done) => {
        testGetSwaggerServers(oasModels.v2.none)
        done()
    })

    it('#getSwaggerServers - plain', (done) => {
        testGetSwaggerServers(oasModels.v2.plain)
        done()
    })

    it('#getSwaggerServers - withPort', (done) => {
        testGetSwaggerServers(oasModels.v2.withPort)
        done()
    })

    it('#getSwaggerServers - withPortandSchemas', (done) => {
        testGetSwaggerServers(oasModels.v2.withPortAndSchemas)
        done()
    })

    it('#getOpenApiServers - none', (done) => {
        testGetOpenApiServers(oasModels.v3.none)
        done()
    })

    it('#getOpenApiServers - plain', (done) => {
        testGetOpenApiServers(oasModels.v3.plain)
        done()
    })

    it('#getOpenApiServers - plainWithPort', (done) => {
        testGetOpenApiServers(oasModels.v3.plainWithPort)
        done()
    })
})
