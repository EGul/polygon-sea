document.currentScript.innerHTML =
'attribute vec3 aVertexPosition;' +
'attribute vec4 aVertexColor;' +
'attribute vec3 aVertexNormal;' +
'uniform mat4 uMVMatrix;' +
'uniform mat4 uPMatrix;' +
'uniform mat3 uNMatrix;' +
'varying vec4 vColor;' +
'varying vec3 lighting;' +
'uniform vec3 uAmbientColor;' +
'uniform vec3 uDirectionalLightColor;' +
'uniform vec3 uDirectionalLightVector;' +
'void main(void) {' +
'    vec3 ambientLight = vec3(0.5, 0.5, 0.5);' +
'    vec3 directionalLightColor = vec3(0.5, 0.5, 0.5);' +
'    vec3 directionalVector = vec3(1, -1, 0);' +
'    vec3 transformedNormal = uNMatrix * aVertexNormal;' +
'    highp float directional = max(dot(transformedNormal.xyz, uDirectionalLightVector), 0.0);' +
'    vColor = aVertexColor;' +
'    lighting = uAmbientColor + (uDirectionalLightColor * directional);' +
'    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);' +
'}';
