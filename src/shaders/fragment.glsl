#version 300 es

precision mediump float;

in float vBrightness;

out vec4 fragColor;

vec4 color = vec4(0.12f, 0.41f, 0.95f, 1.0f);

void main() {
    fragColor = (color * 0.4) + (color * vBrightness * 0.6);
    fragColor.a = 1.0;
}