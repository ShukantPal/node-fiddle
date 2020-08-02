const log = require('../Logger').log;
const jsfiddle = require('../remote/jsfiddle');
const url = require('url');
const flush = require('./flush-fiddle');

const args = require('minimist')(process.argv.slice(2));

async function main()
{
    flush();

    const fiddleUrl = url.parse(args.url || args._[0]);

    if (fiddleUrl.hostname === 'jsfiddle.net')
    {
        const fpath = await jsfiddle.download(fiddleUrl);

        console.log(fpath);

        jsfiddle.process(fpath);

        return;
    }

    log.error('out', `${fiddleUrl.hostname} is not a supported fiddle site. Supported: jsfiddle.net`);
}

main();
