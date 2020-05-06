// Print Working Fiddle
require('../Logger');

const log = require('missionlog').log;
const workspaceJSON = require('../fiddle.workspace.json');

log.info('out', workspaceJSON.fiddle);
