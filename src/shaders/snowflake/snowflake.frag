precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

void main() {
    vec4 texColor = texture2D(uTexture, gl_PointCoord);
    gl_FragColor = texColor * vec4(uColor, 1.0);
}