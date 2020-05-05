# @pixi-build-tools/fiddle
PixiJS + webpack + Babel + @pixi/eslint-config

This package spun off of @alkamin's pixijs-template repo. I have tuned this for local development of PixiJS
so that **you can test your changes to pixi.js-related packages locally**.

The use of ECMAScript allows you to copy/paste your fiddle to online JavaScript editors like CodePen.

## Usage

Clone the repository to use it as a starting point for your own Pixi.js experiments and then remove the remote to clear the way for your own git repo usage

1) `git clone git clone git@github.com:alkamin/pixijs-template.git some-pixi-experiment`
2) `cd some-pixi-experiment`
3) `npm run reinit`

The entry point is `src/index.js` which already has a Pixi.js app initialized.

### Assets

All assets are placed in the `src/assets/` directory and will be available to the app at `assets/`.

### Scripts

* `npm run start` - start the development server
* `npm run build` - build a deployable bundle
* `npm run reinit` - after cloning the repo, run this command to re-initialize the repository for your own project
