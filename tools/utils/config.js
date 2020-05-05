const fs = require('fs');
const path = require('path');

/**
 * @typedef {object} FiddleConfig
 * @property {object} pkgWatch
 */

/**
 * @const {FiddleConfig}
 */
const defaultConfig = {
    pkgWatch: {
    },
};

/**
 * Loads the user's configuration file.
 *
 * If the configuration file couldn't be loaded, then the default configuration is returned instead.
 *
 * @param {string}[cfgPath] - the custom config path provided by the user
 * @returns {FiddleConfig}
 */
module.exports.load = function loadConfig(cfgPath)
{
    if (!cfgPath)
    {
        cfgPath = path.join(process.cwd(), 'fiddle.config.json');

        if (!fs.existsSync(cfgPath))
        {
            console.warn('No fiddle.config.json file found! @pixi-build-tools/fiddle is running with the default settings');
        }
    }

    if (cfgPath)
    {
        let cfgFile;

        try
        {
            cfgFile = fs.readFileSync(cfgPath, 'utf8');
        }
        catch (e)
        {
            if (e.code === 'ENOENT')
            {
                console.error(`Configuration file ${cfgFile} could not be read! Using default settings`);
            }
        }

        const cfg = JSON.parse(cfgFile);

        cfg.configPath = cfgPath;

        return cfg;
    }

    defaultConfig.configPath = __dirname;

    return defaultConfig;
};
