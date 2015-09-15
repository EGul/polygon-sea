
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
var secondNumBlocks = 30;

var moving = [];
function generateMoving() {
  var isLeft = true;
  for (var i = 0; i < numBlocks; i++) {
    var somethingMove = [];
    for (var l = 0; l < secondNumBlocks; l++) {
      somethingMove.push({
        isLeft: isLeft,
        one: {isMoving: false, isMovingUp: false, current: 0},
        two: {isMoving: false, isMovingUp: false, current: 0},
        three: {isMoving: false, isMovingUp: false, current: 0}
      })
      if (!isLeft) {
        isLeft = true;
      }
      else {
        isLeft = false;
      }
    }
    moving.push(somethingMove);
  }
}
generateMoving();

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

  var changeSomething = false;
  var changeColor = false;

  for (var i = 0; i < numBlocks; i++) {

    for (var l = 0; l < secondNumBlocks; l++) {

      var tempVertices = [];

      if (!changeSomething) {
        tempVertices = [
          currentX, currentY, 0.0,
          currentX + 2, currentY - 2, 0.0,
          currentX, currentY - 2, 0.0
        ]
      }
      else {
        tempVertices = [
          currentX, currentY, 0.0,
          currentX + 2, currentY, 0.0,
          currentX + 2, currentY - 2, 0.0
        ]
      }

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

      while (tempColors.length < 3 * 4) {
        tempColors = tempColors.concat(somethingColor);
      }

      var tempIndices = [
        currentIndex, currentIndex + 1, currentIndex + 2
      ];

      vertices = vertices.concat(tempVertices);
      colors = colors.concat(tempColors);
      indices = indices.concat(tempIndices);

      if (!changeSomething) {
        changeSomething = true;
      }
      else {
        currentX += 2;
        changeSomething = false;
      }

      currentIndex += 3;

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
  var randomIndex = Math.floor(Math.random() * 3);

  var moveBlock = moving[randomOne][randomTwo];
  var somethingIsLeft = moveBlock.isLeft;

  var blockOneIndex = 0;
  var blockOneIndexTwo = 0;

  var blockTwoIndex = 0;
  var blockTwoIndexTwo = 0;

  var blockThreeIndex = 0;
  var blockThreeIndexTwo = 0;

  var blockFourIndex = 0;
  var blockFourIndexTwo = 0;

  if (somethingIsLeft) {

    if (randomIndex === 0) {
      blockOneIndex = moveBlock.one;
      if (randomTwo + 1 < secondNumBlocks) {
        blockOneIndexTwo = moving[randomOne][randomTwo + 1].one;
      }
      if (randomTwo - 1 > -1) {
        blockTwoIndexTwo = moving[randomOne][randomTwo - 1].two;
      }
      if ((randomTwo - 1 > -1) && (randomOne + 1 < numBlocks)) {
        blockThreeIndex = moving[randomOne + 1][randomTwo - 2].two;
        blockThreeIndexTwo = moving[randomOne + 1][randomTwo - 1].three;
      }
      if (randomOne + 1 < numBlocks) {
        blockFourIndex = moving[randomOne + 1][randomTwo].three;
      }
    }

    if (randomIndex === 1) {
      blockOneIndex = moveBlock.two;
      if (randomTwo + 1 < secondNumBlocks) {
        blockOneIndexTwo = moving[randomOne][randomTwo + 1].three;
      }
      if (randomTwo + 2 < secondNumBlocks) {
        blockTwoIndex = moving[randomOne][randomTwo + 2].three;
      }
      if ((randomTwo + 2 < secondNumBlocks) && (randomOne - 1 > -1)) {
        blockThreeIndex = moving[randomOne - 1][randomTwo + 2].one;
        blockThreeIndexTwo = moving[randomOne - 1][randomTwo + 3].one;
      }
      if (randomOne - 1 > -1) {
        blockFourIndex = moving[randomOne - 1][randomTwo + 1].two;
      }
    }

    if (randomIndex === 2) {
      blockOneIndex = moveBlock.three;
      if (randomTwo - 1 > -1) {
        blockTwoIndex = moving[randomOne][randomTwo - 1].three;
        blockTwoIndexTwo = moving[randomOne][randomTwo - 2].two;
      }
      if ((randomTwo - 1 > -1) && (randomOne - 1 > -1)) {
        blockThreeIndex = moving[randomOne - 1][randomTwo - 1].two;
      }
      if (randomOne - 1 > -1) {
        blockFourIndex = moving[randomOne - 1][randomTwo].one;
        blockFourIndexTwo = moving[randomOne - 1][randomTwo + 1].one;
      }
    }

  }
  else {

    if (randomIndex === 0) {
      blockOneIndex = moveBlock.one;
      blockOneIndexTwo = moving[randomOne][randomTwo - 1].one;
      if (randomTwo - 2 > -1) {
        blockTwoIndex = moving[randomOne][randomTwo - 2].two;
      }
      if ((randomTwo - 2 > -1) && (randomOne + 1 < numBlocks)) {
        blockThreeIndex = moving[randomOne + 1][randomTwo - 2].three;
        blockThreeIndexTwo = moving[randomOne + 1][randomTwo - 3].two;
      }
      if (randomOne + 1 < numBlocks) {
        blockFourIndex = moving[randomOne + 1][randomTwo - 1].three;
      }
    }

    if (randomIndex === 1) {
      blockOneIndex = moveBlock.two;
      if (randomTwo + 1 < secondNumBlocks) {
        blockTwoIndex = moving[randomOne][randomTwo + 1].one;
        blockTwoIndexTwo = moving[randomOne][randomTwo + 2].one;
      }
      if ((randomTwo + 1 < secondNumBlocks) && (randomOne + 1 < numBlocks)) {
        blockThreeIndex = moving[randomOne + 1][randomTwo + 1].three;
      }
      if (randomOne + 1 < numBlocks) {
        blockFourIndex = moving[randomOne + 1][randomTwo].three;
        blockFourIndexTwo = moving[randomOne + 1][randomTwo - 1].two;
      }
    }

    if (randomIndex === 2) {
      blockOneIndex = moveBlock.three;
      blockOneIndexTwo = moving[randomOne][randomTwo - 1].two;
      if (randomTwo + 1 < secondNumBlocks) {
        blockTwoIndex = moving[randomOne][randomTwo + 1].three;
      }
      if ((randomTwo + 1 < secondNumBlocks) && (randomOne - 1 > -1)) {
        blockThreeIndex = moving[randomOne - 1][randomTwo + 1].one;
        blockThreeIndexTwo = moving[randomOne - 1][randomTwo + 2].one;
      }
      if (randomOne - 1 > -1) {
        blockFourIndex = moving[randomOne - 1][randomTwo].two;
      }
    }

  }

  if (!blockOneIndex.isMoving) {
    blockOneIndex.isMoving = true;
    blockOneIndex.isMovingUp = true;
  }
  if (blockOneIndexTwo) {
    if (!blockOneIndexTwo.isMoving) {
      blockOneIndexTwo.isMoving = true;
      blockOneIndexTwo.isMovingUp = true;
    }
  }

  if (blockTwoIndex) {
    if (!blockTwoIndex.isMoving) {
      blockTwoIndex.isMoving = true;
      blockTwoIndex.isMovingUp = true;
    }
  }
  if (blockTwoIndexTwo) {
    if (!blockTwoIndexTwo.isMoving) {
      blockTwoIndexTwo.isMoving = true;
      blockTwoIndexTwo.isMovingUp = true;
    }
  }

  if (blockThreeIndex) {
    if (!blockThreeIndex.isMoving) {
      blockThreeIndex.isMoving = true;
      blockThreeIndex.isMovingUp = true;
    }
  }
  if (blockThreeIndexTwo) {
    if (!blockThreeIndexTwo.isMoving) {
      blockThreeIndexTwo.isMoving = true;
      blockThreeIndexTwo.isMovingUp = true;
    }
  }

  if (blockFourIndex) {
    if (!blockFourIndex.isMoving) {
      blockFourIndex.isMoving = true;
      blockFourIndex.isMovingUp = true;
    }
  }
  if (blockFourIndexTwo) {
    if (!blockFourIndexTwo.isMoving) {
      blockFourIndexTwo.isMoving = true;
      blockFourIndexTwo.isMovingUp = true;
    }
  }

}

function move() {

  for (var i = 0; i < moving.length; i++) {
    for (var l = 0; l < moving[i].length; l++) {
      ['one', 'two', 'three'].forEach(function (e) {

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

          var temp = (l * (3 * 3)) + (i * (secondNumBlocks * (3 * 3)))
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
  somethingVertexPositionBuffer.numItems = 3 * (numBlocks * secondNumBlocks);

  somethingVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  somethingVertexColorBuffer.itemSize = 4;
  somethingVertexColorBuffer.numItems = 3 * (numBlocks * secondNumBlocks);

  somethingVertexIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, somethingVertexIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  somethingVertexIndexBuffer.itemSize = 1;
  somethingVertexIndexBuffer.numItems = 3 * (numBlocks * secondNumBlocks);

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
