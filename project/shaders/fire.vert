attribute vec3   aVertexPosition;
attribute vec2   aTextureCoord;

uniform mat4     uMVMatrix;
uniform mat4     uPMatrix;
uniform float    uTime;
uniform float    uAmplitude;
uniform float    uFrequency;
uniform float    uSliceSeed;

varying vec2     vTexCoord;

void main() {
    // per‐slice pseudorandom horizontal scroll
    float speed = 0.1 + fract(sin(uSliceSeed * 12.3456)) * 0.789;
    vec2 animatedUV = aTextureCoord + vec2(uTime * speed*0.1, 0.0);

    // text Y flipped cuz was upside-down(??)
    vTexCoord = vec2(animatedUV.s, 1.0 - animatedUV.t);
    
    float wave = sin(uTime * uFrequency + uSliceSeed * 1000.0) * uAmplitude;

    float isApex = step(0.5, aVertexPosition.y);

    vec3 displaced = aVertexPosition 
                   + vec3(wave * isApex*2.0, wave * isApex*1.8, wave * isApex*2.0);

    gl_Position = uPMatrix * uMVMatrix * vec4(displaced, 1.0);
}
