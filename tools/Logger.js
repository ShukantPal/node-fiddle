const { log, LogLevel, tag } = require('missionlog');

log.init(
    {
        fiddle: 'INFO',
        out: 'INFO',
        TODO: 'INFO',
    },
    (level, tag, msg, params) =>
    {
        let prefix = `${level}: [${tag}] `;

        if (tag === 'out')
        {
            prefix = (level === 'INFO') ? `$` : `${level}: `;
        }

        switch (level)
        {
            case LogLevel.ERROR:
                console.error(prefix, msg, ...params);
                break;
            case LogLevel.WARN:
                console.warn(prefix, msg, ...params);
                break;
            case LogLevel.INFO:
                // eslint-disable-next-line no-console
                console.info(prefix, msg, ...params);
                break;
        }
    });

module.exports.log = log;
module.exports.tag = tag;
