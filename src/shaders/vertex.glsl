#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightDirection;
uniform mat4 uRotationMatrix;

out float vBrightness;
out vec4 vColor;

void main() {
    vec3 normal = normalize(vec3(uRotationMatrix * vec4(aVertexNormal, 1.0)));
    vBrightness = max(dot(uLightDirection, normal), 0.0);
    vColor = aVertexColor;
    gl_Position = uProjectionMatrix * uModelViewMatrix * uRotationMatrix * vec4(aVertexPosition, 1.0);
}