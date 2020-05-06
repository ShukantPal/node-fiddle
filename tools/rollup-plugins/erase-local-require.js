const path = require('path');
const fs = require('fs');

/** Rollup plugin that erases local requires to files that are passed. */
module.exports = function eraseLocalRequire(options)
{
    let requires = options.requires;

    if (!Array.isArray(requires))
    {
        console.error('{ requires: should be an array');
        requires = [];
    }
    for (let i = 0, j = requires.length; i < j; i++)
    {
        requires[i] = path.resolve(process.cwd(), requires[i]);

        const extPath = requires[i].endsWith('js') ? requires[i] : `${requires[i]}.js`;

        if (!fs.existsSync(extPath))
        {
            throw new Error(`${requires[i]} doesn't exist`);
        }
    }

    return {
        name: '@pixi-build-tools/fiddle/tools/rollup-plugins/erase-local-require',

        transform(code, id)
        {
            if (!requires.length)
            {
                return null;
            }
            if (!id.endsWith('js'))
            {
                return null;
            }

            for (let i = 0, j = requires.length; i < j; i++)
            {
                const requireExpression = new RegExp(
                    `(require)?\((\s?)('|")${path.relative(path.join(id, '..'), requires[i])}('|")(\s?)+\)`, 'g');

                // TODO: Replace multiple occurences?
                code = code.replace(requireExpression, '{}');
            }

            return { code };
        },
    };
};
