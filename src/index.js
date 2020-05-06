const { BatchShaderFactory, AggregateUniformsBatchFactory, BatchRendererPluginFactory, AttributeRedirect, UniformRedirect }
 = PIXI.brend;

const iu = 'https://i.imgur.com/elyVhsP.jpeg';

// Define the geometry of ExampleFigure.
const attribSet = [
    new AttributeRedirect({
        source: 'vertexData',
        attrib: 'aVertex',
        type: 'float32',
        size: 2,
        glType: PIXI.TYPES.FLOAT,
        glSize: 2,
    }),
    new AttributeRedirect({
        source: 'uvs',
        attrib: 'aTextureCoord',
        type: 'float32',
        size: 2,
        glType: PIXI.TYPES.FLOAT,
        glSize: 2,
    }),
];

const shaderFunction = new BatchShaderFactory(
// Vertex Shader
    `
attribute vec2 aVertex;
attribute vec2 aTextureCoord;
attribute float aTextureId;

varying float vTextureId;
varying vec2 vTextureCoord;

uniform mat3 projectionMatrix;

void main()
{
    gl_Position = vec4((projectionMatrix * vec3(aVertex.xy, 1)).xy, 0, 1);
    vTextureId = aTextureId;
    vTextureCoord = aTextureCoord;
}
`,

    // Fragment Shader
    `
// You can also use this in the vertex shader.
uniform int shadingType [1];

uniform sampler2D uSamplers[%texturesPerBatch%];/* %texturesPerBatch% is a macro and will become a number */\n
varying float vTextureId;
varying vec2 vTextureCoord;

void main(void){
    vec4 color;
    int type = shadingType[0];

    /* get color & shaderType */
    for (int k = 0; k < %texturesPerBatch%; ++k)
    {
        if (int(vTextureId) == k) {
            color = texture2D(uSamplers[k], vTextureCoord);
            break;
        }
    }

    if (type == 1) {
        gl_FragColor = color;
    } else {
        gl_FragColor = vec4(color.rgb * vTextureCoord.x, vTextureCoord.x);
    }
}
`,
    {}).derive();

const uniformSet = [
    new UniformRedirect({ source: 'type', uniform: 'shadingType' }),
];

const ExampleRenderer = BatchRendererPluginFactory.from({
    uniformSet,

    // Previous example's stuff
    attribSet,
    indexProperty: 'indices',
    textureProperty: 'texture',
    texIDAttrib: 'aTextureId',
    shaderFunction,

    BatchFactoryClass: AggregateUniformsBatchFactory,
});

PIXI.Renderer.registerPlugin('exrend', ExampleRenderer);
const app = new PIXI.Application({ width: 1024, height: 1024, backgroundColor: 0xff });

document.body.appendChild(app.view);

const sprite = PIXI.Sprite.from(iu);

sprite.pluginName = 'exrend';
sprite.width = 512;
sprite.height = 512;
sprite.type = 1;

const sprite2 = PIXI.Sprite.from(iu);

sprite2.pluginName = 'exrend';
sprite2.width = 512;
sprite2.height = 512;
sprite2.position.x = 512;
sprite2.type = 0;

app.stage.addChild(sprite);
app.stage.addChild(sprite2);
app.stage.scale.set(0.2);

window.renderer = app.renderer;

