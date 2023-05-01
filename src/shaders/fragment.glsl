#version 300 es

precision mediump float;

in float vBrightness;
in vec4 vColor;

out vec4 fragColor;

void main() {
    fragColor = (vColor * 0.4) + (vColor * vBrightness * 0.6);
    fragColor.a = 1.0;
}