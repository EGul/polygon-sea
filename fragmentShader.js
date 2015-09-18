document.currentScript.innerHTML =
'precision mediump float;' +
'varying vec4 vColor;' +
'varying vec3 lighting;' +
'void main(void) {' +
'    gl_FragColor = vec4(vColor.rgb * lighting, vColor.a);' +
'}';
