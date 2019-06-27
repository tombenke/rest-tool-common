import _ from 'lodash'
import url from 'url'

const defaultServer = {
    protocol: 'http',
    hostName: 'localhost',
    port: 80,
    basePath: '/'
}

export const getSwaggerServers = oasApi => {
    const { host, port } = parseSwaggerHost(_.get(oasApi, 'host', defaultServer.hostName))
    return flattenServerProtocols([
        {
            protocols: _.get(oasApi, 'schemas', [defaultServer.protocol]),
            hostName: host,
            port: parseInt(port, 10),
            basePath: _.get(oasApi, 'basePath', defaultServer.basePath)
        }
    ])
}

export const parseSwaggerHost = hostStr => {
    const [host, port] = hostStr.split(':')
    return { host: host, port: port ? port : 80 }
}

export const flattenServerProtocols = servers =>
    _.flatMap(servers, server =>
        _.map(server.protocols, protocol => ({
            protocol: protocol,
            port: server.port,
            hostName: server.hostName,
            basePath: server.basePath
        }))
    )

export const getOpenApiServers = oasApi =>
    _.map(
        _.get(oasApi, 'servers', [
            {
                url: `${defaultServer.protocol}://${defaultServer.hostName}:${defaultServer.port}${defaultServer.basePath}`
            }
        ]),
        server => getServerDetails(server)
    )

export const getServerDetails = server => {
    const { protocol, hostname, port, path } = url.parse(server.url)
    return {
        protocol: protocol.replace(':', ''),
        hostName: hostname,
        port: port !== null ? parseInt(port, 10) : defaultServer.port,
        basePath: path
    }
}
