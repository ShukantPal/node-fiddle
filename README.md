# @pixi-build-tools/fiddle
PixiJS + webpack + Babel + @pixi/eslint-config

This package spun off of @alkamin's pixijs-template repo. I have tuned this for local development of PixiJS
so that **you can test your changes to pixi.js-related packages locally**.

The use of ECMAScript allows you to copy/paste your fiddle to online JavaScript editors like CodePen.

## Usage

Clone the repository and create your first fiddle:

1) `git clone https://github.com/SukantPal/pixi-fiddle`
2) `npm run open -- --fiddle basic-fiddle`
3) `npm run start`

The entry point is `src/index.js`. This will be initialized with some boilerplate code.

## Config File

You can create a config file `fiddle.config.json` to register your local PixiJS repo. For example,

```
{
    pkgWatch: {
        "pixi.js" "../pixi.js/bundles/pixi.js/lib/pixi"
    }
}
```

Make sure path is to the CommonJS bundle (not the project root). Support for adding more packages will be
added.

## Template

If you want to change what code new fiddles have, change the tools/template folder and update `template.registrar.json`
with the files you want "processed".

### Assets

All assets are placed in the `src/assets/` directory and will be available to the app at `assets/`.

### Scripts

* `npm run start` - start the development server
* `npm run build` - build a deployable bundle
* `npm run reinit` - after cloning the repo, run this command to re-initialize the repository for your own project
