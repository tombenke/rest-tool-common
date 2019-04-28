'use strict';

var _services = require('./services');

var services = _interopRequireWildcard(_services);

var _oas = require('./oas');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
    services: services,
    loadOas: _oas.loadOas
};