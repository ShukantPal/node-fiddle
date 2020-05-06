// TODO

const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const raw = require('rollup-plugin-string').string;
const erase = require('./tools/rollup-plugins/erase-local-require');

const configJSON = require('./tools/utils/config').load();
const workspaceJSON = require('./tools/utils/workspace').load();

const plugins = [
    erase({
        requires: Object.values(configJSON.pkgWatch || []),
    }),
    commonjs(),
    resolve(),
    raw({
        include: ['**/*.vert', '**/*.frag', '**/*.glsl', '**/*.txt'],
    }),
];

module.exports = {
    input: 'src/index.js',
    plugins,
    external: Object.values(configJSON.pkgWatch),
    output: {
        banner: '// This file was auto-exported using @pixi-build-tools/fiddle!',
        file: `export/${workspaceJSON.fiddle || 'fiddle'}.js`,
        format: 'cjs',
    },
};
