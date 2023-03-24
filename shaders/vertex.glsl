#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightDirection;
uniform mat4 uRotationMatrix;

out float vBrightness;

void main() {
    vBrightness = max(dot(uLightDirection, aVertexNormal), 0.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * uRotationMatrix * vec4(aVertexPosition, 1.0);
}