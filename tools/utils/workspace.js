const fs = require('fs');
const path = require('path');

module.exports.load = function loadWorkspace()
{
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../fiddle.workspace.json')));
};

module.exports.flush = function flushWorkspace(wk)
{
    fs.writeFileSync(path.join(__dirname, '../fiddle.workspace.json'), JSON.stringify(wk), 'utf8');
};
