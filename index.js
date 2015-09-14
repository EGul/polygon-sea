
var gl;

var somethingVertexPositionBuffer;
var somethingVertexColorBuffer;
var somethingVertexIndexBuffer;

var shaderProgram;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

var vertices = [];
var colors = [];
var indices = [];

var numBlocks = 5;
var secondNumBlocks = 25;

var moving = [];
for (var i = 0; i < numBlocks; i++) {
  var somethingMove = [];
  for (var l = 0; l < secondNumBlocks; l++) {
    somethingMove.push({
      one: {isMoving: false, isMovingUp: false, current: 0},
      two: {isMoving: false, isMovingUp: false, current: 0},
      three: {isMoving: false, isMovingUp: false, current: 0},
      four: {isMoving: false, isMovingUp: false, current: 0},
    })
  }
  moving.push(somethingMove);
}

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

function radToDeg(rad) {
  return rad * (180 / Math.PI);
}

function generateVertices() {

  var currentX = -1;
  var currentY = 1;
  var currentIndex = 0;

  var changeColor = false;

  for (var i = 0; i < numBlocks; i++) {

    for (var l = 0; l < secondNumBlocks; l++) {

      var tempVertices = [
        currentX, currentY, 0.0,
        currentX + 2, currentY, 0.0,
        currentX + 2, currentY - 2, 0.0,
        currentX, currentY - 2, 0.0
      ];

      var tempColors = [];
      var somethingColor = [];

      if (!changeColor) {
        somethingColor = [0.0, 0.0, 0.0, 1.0];
        changeColor = true;
      }
      else {
        somethingColor = [0.5, 0.5, 0.5, 1.0];
        changeColor = false;
      }

      while (tempColors.length < 4 * 4) {
        tempColors = tempColors.concat(somethingColor);
      }

      var tempIndices = [
        currentIndex, currentIndex + 1, currentIndex + 2,
        currentIndex + 2, currentIndex + 3, currentIndex
      ];

      vertices = vertices.concat(tempVertices);
      colors = colors.concat(tempColors);
      indices = indices.concat(tempIndices);

      currentX += 2;
      currentIndex += 4;

    }

    currentX = -1;
    currentY += 2;

  }

}

function startMove() {
  setInterval(function () {
    move();
  }, 100);
  setInterval(function () {
    setMove();
  }, 100);
}

function setMove() {

  var randomOne = Math.floor(Math.random() * numBlocks);
  var randomTwo = Math.floor(Math.random() * secondNumBlocks);
  var randomIndex = Math.floor(Math.random() * 4);

  var moveBlock = moving[randomOne][randomTwo];

  var index = 0;
  var indexTwo = 0;
  var indexThree = 0;
  var indexFour = 0;

  if (randomIndex === 0) {
    index = moveBlock.one;
    if (randomTwo - 1 > -1) {
      indexTwo = moving[randomOne][randomTwo - 1].two;
    }
    if ((randomTwo - 1 > -1) && (randomOne + 1 < numBlocks)) {
      indexThree = moving[randomOne + 1][randomTwo - 1].three;
    }
    if (randomOne + 1 < numBlocks) {
      indexFour = moving[randomOne + 1][randomTwo].four;
    }
  }

  if (randomIndex === 1) {
    index = moveBlock.two;
    if (randomTwo + 1 < secondNumBlocks) {
      indexTwo = moving[randomOne][randomTwo + 1].one;
    }
    if (randomTwo + 1 < secondNumBlocks && (randomOne + 1 < numBlocks)) {
      indexThree = moving[randomOne + 1][randomTwo + 1].four;
    }
    if (randomOne + 1 < numBlocks) {
      indexFour = moving[randomOne + 1][randomTwo].three;
    }
  }

  if (randomIndex === 2) {
    index = moveBlock.three;
    if (randomTwo + 1 < secondNumBlocks) {
      indexTwo = moving[randomOne][randomTwo + 1].four;
    }
    if ((randomTwo + 1 < secondNumBlocks) && (randomOne - 1 > -1)) {
      indexThree = moving[randomOne - 1][randomTwo + 1].one;
    }
    if (randomOne - 1 > -1) {
      indexFour = moving[randomOne - 1][randomTwo].two;
    }
  }

  if (randomIndex === 3) {
    index = moveBlock.four;
    if (randomTwo - 1 > -1) {
      indexTwo = moving[randomOne][randomTwo - 1].three;
    }
    if ((randomTwo - 1 > -1) && (randomOne - 1 > -1)) {
      indexThree = moving[randomOne - 1][randomTwo - 1].two;
    }
    if (randomOne - 1 > -1) {
      indexFour = moving[randomOne - 1][randomTwo].one;
    }
  }

  if (!index.isMoving) {
    index.isMoving = true;
    index.isMovingUp = true;
  }

  if (indexTwo) {
    if (!indexTwo.isMoving) {
      indexTwo.isMoving = true;
      indexTwo.isMovingUp = true;
    }
  }

  if (indexThree) {
    if (!indexThree.isMoving) {
      indexThree.isMoving = true;
      indexThree.isMovingUp = true;
    }
  }

  if (indexFour) {
    if (!indexFour.isMoving) {
      indexFour.isMoving = true;
      indexFour.isMovingUp = true;
    }
  }

}

function move() {

  for (var i = 0; i < moving.length; i++) {
    for (var l = 0; l < moving[i].length; l++) {
      ['one', 'two', 'three', 'four'].forEach(function (e) {

        var block = moving[i][l][e];

        if (block.isMoving) {

          if (block.isMovingUp) {
            block.current = block.current + 0.1;
            if (block.current > 1) {
              block.isMovingUp = false;
            }
          }
          else {
            block.current = block.current - 0.1;
            if (block.current < 0) {
              block.current = 0;
              block.isMoving = false;
            }
          }

          var temp = (l * (4 * 3)) + (i * (secondNumBlocks * (4 * 3)))
          var indice = 0;

          if (e === 'one') {
            indice = temp + 2;
          }
          if (e === 'two') {
            indice = temp + 5;
          }
          if (e === 'three') {
            indice = temp + 8;
          }
          if (e === 'four') {
            indice = temp + 11;
          }

          vertices[indice] = block.current;

        }

      });
    }
  }

  initBuffers();
  drawScene();

}

function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}

function initGL(canvas) {

  try {
    gl = canvas.getContext('experimental-webgl');
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch(e) {
  }

  if (!gl) {
    console.log('could not initialise webgl');
  }

}

function getShader(gl, id) {

  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = '';
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  }
  else if (shaderScript.type == 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  }
  else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function initShaders() {

  var fragmentShader = getShader(gl, 'shader-fs');
  var vertexShader = getShader(gl, 'shader-vs');

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log('could not initialize shaders');
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, 'aVertexColor');
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');

}

function initBuffers() {

  somethingVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexPositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  somethingVertexPositionBuffer.itemSize = 3;
  somethingVertexPositionBuffer.numItems = 4 * (numBlocks * secondNumBlocks);

  somethingVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  somethingVertexColorBuffer.itemSize = 4;
  somethingVertexColorBuffer.numItems = 3 * (numBlocks * secondNumBlocks);

  somethingVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, somethingVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  somethingVertexIndexBuffer.itemSize = 1;
  somethingVertexIndexBuffer.numItems = 6 * (numBlocks * secondNumBlocks);

}

function drawScene() {

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  mat4.identity(mvMatrix);
  mat4.translate(mvMatrix, [-35.0, -17.0, -45]);
  mat4.rotateX(mvMatrix, degToRad(-45));

  gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexPositionBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, somethingVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexColorBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, somethingVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, somethingVertexIndexBuffer);
  setMatrixUniforms();
  gl.drawElements(gl.TRIANGLES, somethingVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}

function webGLStart() {

  var canvas = document.getElementById('canvas');

  generateVertices();

  initGL(canvas);
  initShaders();
  initBuffers();

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  drawScene();
  //startMove();

}
