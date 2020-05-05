const fse = require('fs-extra');
const path = require('path');
const workspace = require('../utils/workspace');

const args = require('minimist')(process.argv.slice(2));

const basePath = process.cwd();
const srcDir = path.join(basePath, './src');
const workspaceDir = path.join(basePath, './fiddle-workspace');
const fiddleDir = path.join(workspaceDir, workspace.load().fiddle);

fse.removeSync(path.join(fiddleDir, './*'));
fse.copySync(srcDir, fiddleDir);
