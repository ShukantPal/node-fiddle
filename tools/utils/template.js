const path = require('path');
const fs = require('fs');
const log = require('missionlog').log;

function resolveMacros(file, filePath, cfg, workspace)
{
    let pixiPath;

    if (cfg.pkgWatch && cfg.pkgWatch['pixi.js'])
    {
        pixiPath = cfg.pkgWatch['pixi.js'];

        if (!path.isAbsolute(pixiPath))
        {
            pixiPath = path.resolve(cfg.configPath, pixiPath);
        }

        pixiPath = path.relative(filePath, pixiPath);
    }
    else
    {
        pixiPath = 'pixi.js';
    }

    console.log(`Resolving macros ${filePath}`);

    file = file.replace(/%pkg\(pixi.js\)%/g, pixiPath);
    file = file.replace(/%fiddle%/g, workspace.fiddle || 'Untitled Fiddle');

    return file;
}

/**
 * This is invoked right after initializing the source directory with the template
 * to run code-processing tools.
 *
 * + Runs macro processor on all files. (right now %fiddle% and %pkg(pixi.js)% is supported)
 *
 * @param {string} srcDir - the source directory
 * @param {string} workspace - the workspace settings (`fiddle.workspace.json`)
 * @param {object} config - user config
 * @param {string[]} registrar - the list of files to touch
 */
module.exports.init = function initTemplate(srcDir, workspace, config, registrar)
{
    for (let i = 0, j = registrar.length; i < j; i++)
    {
        const filePath = path.join(srcDir, registrar[i]);
        let file = fs.readFileSync(filePath, 'utf8');

        file = resolveMacros(file, filePath, config, workspace);

        fs.writeFileSync(filePath, file, 'utf8');
    }
};
