#version 300 es

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTextureCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uLightDirection;
uniform mat4 uRotationMatrix;
uniform vec3 uObjMiddle;

out float vBrightness;
out vec2 vTextureCoord;

void main() {
    vec3 normal = normalize(vec3(uRotationMatrix * vec4(aVertexNormal, 1.0)));
    vBrightness = max(dot(uLightDirection, normal), 0.0);

    vTextureCoord = aTextureCoord;

    vec4 position = vec4(aVertexPosition - uObjMiddle, 1.0);
    gl_Position = uProjectionMatrix * uModelViewMatrix * uRotationMatrix * position;
}