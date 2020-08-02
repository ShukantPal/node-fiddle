const childProcess = require('child_process');
const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');
const log = require('../Logger').log;
const JSDOM = require('jsdom').JSDOM;

/**
 * Downloads the JSFiddle into the staging area.
 *
 * @param {string} url - the fiddle url
 * @returns {Promise<string>} resolves when the fiddle is downloaded with absolute path to fiddle .html file
 */
module.exports.download = function downloadJSFiddle(url)
{
    let fiddlePath = path.parse(url.pathname);

    // We don't want the revision
    if (!isNaN(parseInt(fiddlePath.name, 10)) && parseInt(fiddlePath.name, 10).toString() === fiddlePath.name)
    {
        fiddlePath = path.parse(path.resolve(url.pathname, '../'));
    }

    const downloadProc = childProcess.exec(`jsfiddle-downloader -l ${url.href}`, {
        cwd: path.join(__dirname, '../staging'),
    });

    downloadProc.stdout.pipe(process.stdout);

    const downloadPromise = new Promise((resolve) =>
    {
        downloadProc.on('exit', () => resolve(`${path.resolve(__dirname, '../staging', fiddlePath.name)}.html`));
    });

    return downloadPromise;
};

/**
 * Processes the downloaded JSFiddle and places the files into srcDir.
 *
 * @param {string} fiddleFile - path to the downloaded *.html fiddle
 */
module.exports.process = function processFiddle(fiddleFile)
{
    const basePath = process.cwd();
    const srcDir = path.join(basePath, 'src');

    if (fs.existsSync(srcDir))
    {
        fse.emptyDirSync(srcDir);
    }

    const fiddle = fs.readFileSync(fiddleFile, 'utf8');
    const fiddleDOM = new JSDOM(fiddle);
    const fiddleDoc = fiddleDOM.window.document;

    let buffer = '// No JavaScript was found :(';

    for (let i = 0; i < fiddleDoc.head.children.length; i++)
    {
        const element = fiddleDoc.head.children[i];

        if (element.tagName === 'SCRIPT')
        {
            if (element.attributes.src && element.attributes.src.value === '/js/lib/dummy.js')
            {
                fiddleDoc.head.removeChild(element);
            }
            else if (element.attributes.src)
            {
                log.info('TODO', `Remove (script) ${element.attributes.src.value}`);
                log.info('TODO', '@pixi-build-tools/fiddle currently doesn\'t support auto-resolving CDN links to packages');
            }
        }
        else if (element.id === 'compiled-css')
        {
            // TODO: Extract CSS
            fiddleDoc.head.removeChild(element);
        }
    }

    const links = fiddleDoc.querySelector('link');

    if (links)
    {
        links.parentElement.removeChild(links);
    }

    // Find the <script> in the body and replace it with <script src="index.js"></script>
    for (let i = 0; i < fiddleDoc.body.children.length; i++)
    {
        const element = fiddleDoc.body.children[i];

        if (element.tagName === 'SCRIPT' && !element.attributes.src)
        {
            const indexScript = fiddleDoc.createElement('script');

            indexScript.src = 'index.js';
            fiddleDoc.body.replaceChild(indexScript, element);
            buffer = element.innerHTML;
            break;
        }
    }

    const indexHtmlFile = path.join(srcDir, './index.html');
    const indexJsFile = path.join(srcDir, './index.js');

    const html = fiddleDoc.documentElement.outerHTML.split('\n').filter((line) => line.trim() !== '').join('\n');
    const js = buffer.split('\n').slice(1, -1).map((line) => line.trimRight()).join('\n');

    fse.ensureFileSync(indexHtmlFile);
    fse.ensureFileSync(indexJsFile);
    fs.writeFileSync(path.join(srcDir, './index.html'), html, 'utf8');
    fs.writeFileSync(path.join(srcDir, './index.js'), js, 'utf8');
};
