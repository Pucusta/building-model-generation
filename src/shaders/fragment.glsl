#version 300 es

precision mediump float;

in float vBrightness;
in vec2 vTextureCoord;

uniform sampler2D uTexture;

out vec4 fragColor;

void main() {
    fragColor = texture(uTexture, vTextureCoord);
    fragColor = (fragColor * 0.4) + (fragColor * vBrightness * 0.6);
    fragColor.a = 1.0;
}