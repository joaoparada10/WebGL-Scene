#ifdef GL_ES
precision highp float;
#endif

varying vec2     vTexCoord;
uniform sampler2D uSampler;

void main() {
    vec4 col = texture2D(uSampler, vTexCoord);

    if (col.a < 0.2) discard;

    gl_FragColor = col;
}
