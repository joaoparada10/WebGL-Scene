#ifdef GL_ES
precision highp float;
#endif

varying vec2     vTexCoord;

uniform sampler2D  uTexH;
uniform sampler2D  uTexAux;
uniform float      uBlend;


void main() {
    vec4 cH   = texture2D(uTexH,   vTexCoord);
    vec4 cAux = texture2D(uTexAux, vTexCoord);

    vec4 c = mix(cH, cAux, uBlend);

    if (c.a < 0.5) discard;

    gl_FragColor = c;
}
