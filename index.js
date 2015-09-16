
var gl;

var somethingVertexPositionBuffer;
var somethingVertexColorBuffer;
var somethingVertexNormalBuffer;
var somethingVertexIndexBuffer;

var shaderProgram;

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var nMatrix = mat3.create();

var vertices = [];
var colors = [];
var normals = [];
var indices = [];

var numBlocks = 10;
var secondNumBlocks = 50;

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

  var changeSide = false;

  for (var i = 0; i < numBlocks; i++) {

    for (var l = 0; l < secondNumBlocks; l++) {

      if (!changeSide) {
        vertices = vertices.concat([
          currentX, currentY, 0.0,
          currentX + 2, currentY - 2, 0.0,
          currentX, currentY - 2, 0.0
        ]);
      }
      else {
        vertices = vertices.concat([
          currentX, currentY, 0.0,
          currentX + 2, currentY, 0.0,
          currentX + 2, currentY - 2, 0.0
        ]);
      }

      for (var j = 0; j < 3 * 4; j++) {
        colors = colors.concat([0.1, 0.1, 0.1, 1]);
      }

      for (var j = 0; j < 3; j++) {
        normals = normals.concat(0, 0, -1);
      }

      indices = indices.concat(currentIndex, currentIndex + 1, currentIndex + 2);

      if (!changeSide) {
        changeSide = true;
      }
      else {
        currentX += 2;
        changeSide = false;
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
  }, 25);
  setInterval(function () {
    setMove();
  }, 10);
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

        var point = moving[i][l][e];
        var indice = (l * (3 * 3)) + (i * (secondNumBlocks * (3 * 3)));

        if (point.isMoving) {

          if (point.isMovingUp) {
            point.current = point.current + 0.01;
            if (point.current > 1.0) {
              point.isMovingUp = false;
            }
          }
          else {
            point.current = point.current - 0.01;
            if (point.current < 0) {
              point.current = 0;
              point.isMoving = false;
            }
          }

          if (e === 'one') vertices[indice + 2] = point.current;
          if (e === 'two') vertices[indice + 5] = point.current;
          if (e === 'three') vertices[indice + 8] = point.current;

          var pointOne = [vertices[indice], vertices[indice + 1], vertices[indice + 2]];
          var pointTwo = [vertices[indice + 3], vertices[indice + 4], vertices[indice + 5]];
          var pointThree = [vertices[indice + 6], vertices[indice + 7], vertices[indice + 8]];

          var vectorOne = {
            x: pointTwo[0] - pointOne[0],
            y: pointTwo[1] - pointOne[1],
            z: pointTwo[2] - pointOne[2]
          }
          var vectorTwo = {
            x: pointThree[0] - pointOne[0],
            y: pointThree[1] - pointOne[1],
            z: pointThree[2] - pointOne[2]
          }

          var normalX = (vectorOne.y * vectorTwo.z) - (vectorOne.z * vectorTwo.y);
          var normalY = (vectorOne.z * vectorTwo.x) - (vectorOne.x * vectorTwo.z);
          var normalZ = (vectorOne.x * vectorTwo.y) - (vectorOne.y * vectorTwo.x);

          if (normalX > 1) normalX = 1;
          if (normalX < -1) normalX = -1;
          if (normalY > 1) normalY = 1;
          if (normalY < -1) normalY = -1;
          if (normalZ > 1) normalZ = 1;
          if (normalZ < -1) normalZ = -1;

          normals[indice] = normalX;
          normals[indice + 1] = normalY;
          normals[indice + 2] = normalZ
          normals[indice + 3] = normalX;
          normals[indice + 4] = normalY;
          normals[indice + 5] = normalZ
          normals[indice + 6] = normalX;
          normals[indice + 7] = normalY;
          normals[indice + 8] = normalZ;

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

  mat4.toInverseMat3(mvMatrix, nMatrix);
  mat3.transpose(nMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, nMatrix);

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

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, 'aVertexNormal');
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, 'uNMatrix');

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

  somethingVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  somethingVertexNormalBuffer.itemSize = 3;
  somethingVertexNormalBuffer.numItems = 3 * (numBlocks * secondNumBlocks);

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

  gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexNormalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, somethingVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

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
