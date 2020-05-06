// flush-fiddle saves the srcDir into fiddleDir

const fse = require('fs-extra');
const path = require('path');
const workspace = require('../utils/workspace');

const basePath = process.cwd();
const srcDir = path.join(basePath, './src');
const workspaceDir = path.join(basePath, './fiddle-workspace');
const fiddleDir = path.join(workspaceDir, workspace.load().fiddle);

fse.removeSync(path.join(fiddleDir, './*'));
fse.copySync(srcDir, fiddleDir);
