require('../Logger');

const yesno = require('yesno');
const args = require('minimist')(process.argv.slice(2));
const log = require('missionlog').log;
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

async function main()
{
    if (!args._ || !args._.length)
    {
        log.error('out', 'You didn\'t provide a fiddle to delete. Usage: npm run delete fiddleName');
    }

    const targetFiddle = args._[0];

    const basePath = process.cwd();
    const fiddleDir = path.join(basePath, `fiddle-workspace/${targetFiddle}`);

    const consent = await yesno({
        question: `Do you want to delete ${fiddleDir}?`,
        defaultValue: null,
    });

    if (!consent)
    {
        log.info('out', 'User terminated deletion process');

        return;
    }

    if (fs.existsSync(fiddleDir))
    {
        fse.removeSync(fiddleDir);
    }
}

main();
