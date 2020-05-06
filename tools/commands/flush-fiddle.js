// flush-fiddle saves the srcDir into fiddleDir

const log = require('../Logger').log;
const fse = require('fs-extra');
const path = require('path');
const workspace = require('../utils/workspace');

const flushFiddle = module.exports = function flushFiddle()
{
    const basePath = process.cwd();
    const srcDir = path.join(basePath, './src');
    const workspaceDir = path.join(basePath, './fiddle-workspace');
    const fiddleDir = path.join(workspaceDir, workspace.load().fiddle);

    fse.ensureDirSync(srcDir);
    fse.removeSync(path.join(fiddleDir, './*'));
    fse.copySync(srcDir, fiddleDir);

    log.info('fiddle', 'Flushed current fiddle');
};

// Run command if run from command-line
if (path.parse(process.argv[1]).name === 'flush-fiddle')
{
    flushFiddle();
}
