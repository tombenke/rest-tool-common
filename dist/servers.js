'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getServerDetails = exports.getOpenApiServers = exports.flattenServerProtocols = exports.parseSwaggerHost = exports.getSwaggerServers = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultServer = {
    protocol: 'http',
    hostName: 'localhost',
    port: 80,
    basePath: '/'
};

var getSwaggerServers = exports.getSwaggerServers = function getSwaggerServers(oasApi) {
    var _parseSwaggerHost = parseSwaggerHost(_lodash2.default.get(oasApi, 'host', defaultServer.hostName)),
        host = _parseSwaggerHost.host,
        port = _parseSwaggerHost.port;

    return flattenServerProtocols([{
        protocols: _lodash2.default.get(oasApi, 'schemas', [defaultServer.protocol]),
        hostName: host,
        port: parseInt(port, 10),
        basePath: _lodash2.default.get(oasApi, 'basePath', defaultServer.basePath)
    }]);
};

var parseSwaggerHost = exports.parseSwaggerHost = function parseSwaggerHost(hostStr) {
    var _hostStr$split = hostStr.split(':'),
        _hostStr$split2 = _slicedToArray(_hostStr$split, 2),
        host = _hostStr$split2[0],
        port = _hostStr$split2[1];

    return { host: host, port: port ? port : 80 };
};

var flattenServerProtocols = exports.flattenServerProtocols = function flattenServerProtocols(servers) {
    return _lodash2.default.flatMap(servers, function (server) {
        return _lodash2.default.map(server.protocols, function (protocol) {
            return {
                protocol: protocol,
                port: server.port,
                hostName: server.hostName,
                basePath: server.basePath
            };
        });
    });
};

var getOpenApiServers = exports.getOpenApiServers = function getOpenApiServers(oasApi) {
    return _lodash2.default.map(_lodash2.default.get(oasApi, 'servers', [{
        url: defaultServer.protocol + '://' + defaultServer.hostName + ':' + defaultServer.port + defaultServer.basePath
    }]), function (server) {
        return getServerDetails(server);
    });
};

var getServerDetails = exports.getServerDetails = function getServerDetails(server) {
    var _url$parse = _url2.default.parse(server.url),
        protocol = _url$parse.protocol,
        hostname = _url$parse.hostname,
        port = _url$parse.port,
        path = _url$parse.path;

    return {
        protocol: protocol.replace(':', ''),
        hostName: hostname,
        port: port !== null ? parseInt(port, 10) : defaultServer.port,
        basePath: path
    };
};