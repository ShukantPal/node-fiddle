const workspace = require('../utils/workspace');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const log = require('missionlog').log;
const template = require('../utils/template');
const fse = require('fs-extra');
const config = require('../utils/config');
const yesno = require('yesno');

const args = require('minimist')(process.argv.slice(2));

async function main()
{
    const wk = workspace.load();
    const basePath = process.cwd();
    const workspacePath = path.join(basePath, './fiddle-workspace');
    const srcDir = path.join(process.cwd(), 'src');

    // Registrar contains all the files in template
    const registrar = JSON.parse(fs.readFileSync(path.join(__dirname, '../template.registrar.json'), 'utf8')).registrar;

    if (!args.fiddle)
    {
        throw new Error('No fiddle name provided via --fiddle');
    }

    if (!fs.existsSync(srcDir))
    {
        fs.mkdirSync(srcDir);
    }

    let noSave = !args.save;

    if (noSave)
    {
        noSave = await yesno({
            question: 'Do you want to delete the current source directory?',
            defaultValue: null,
        });
    }

    if (!noSave)
    {
        if (!wk.fiddle)
        {
            console.warn('The current fiddle has no name. It is being saved to fiddle-workspace/.fiddle-archive');

            const fiddleArchiveDir = path.join(basePath, 'fiddle-workspace/.fiddle-archive');

            rimraf.sync(path.join(fiddleArchiveDir, './*'));

            fse.copySync(srcDir, fiddleArchiveDir);

            rimraf.sync(path.join(srcDir, './*'));
        }
        else
        {
            // eslint-disable-next-line
            console.log(`Saving current fiddle: ${wk.fiddle}`);

            const fiddleDir = path.join(basePath, `fiddle-workspace/${wk.fiddle}`);

            rimraf.sync(path.join(fiddleDir, './*'));

            fse.copySync(srcDir, fiddleDir);

            rimraf.sync(path.join(srcDir, './*'));
        }
    }

    const fiddleDir = path.join(workspacePath, args.fiddle);

    wk.fiddle = args.fiddle;

    if (fs.existsSync(fiddleDir))
    {
        fse.copySync(fiddleDir, srcDir);
    }
    else
    {
        log.info('fiddle', '@pixi-build-tools/fiddle created a new fiddle!!!');

        const templateDir = path.join(__dirname, '../template');

        fse.copySync(templateDir, srcDir);

        template.init(srcDir, wk, config.load(), registrar);
    }

    workspace.flush(wk);
}

main();
