const PIXI = window.PIXI || require('../../pixi.js/bundles/pixi.js/lib/pixi');
const { InstancedRendererPluginFactory } = require('../../pixi-essentials/packages/instanced-renderer/lib/instanced-renderer.cjs');

const geomVertexSrc = require('./geom.vert').default;
const geomFragSrc = require('./geom.frag').default;

const geom = new PIXI.Geometry()
    .addAttribute('aVertexPosition', Float32Array.from([
        0, 0,
        100, 0,
        0, 100,
    ]), 2, false, PIXI.TYPES.FLOAT, 0, 0, false)
    .addAttribute('aXY', new Float32Array(), 2, false, PIXI.TYPES.FLOAT, 0, 0, true);

const rectRenderer = InstancedRendererPluginFactory.from({
    instanceBuilder: {
        aVertexPosition: 'vertexData',
        aXY: '_xy',
    },
    geometry: geom,
    shader: new PIXI.Shader(new PIXI.Program(geomVertexSrc, geomFragSrc)),
});

PIXI.Renderer.registerPlugin('rectRenderer', rectRenderer);

const app = new PIXI.Application({
    width: 1024,
    height: 2048,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x999999,
});

document.body.appendChild(app.view);

const sprite = new PIXI.Sprite();

app.stage.addChild(sprite);

sprite.pluginName = 'rectRenderer';
sprite._xy = [0, 0];
