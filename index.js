
function PolygonSea(opts) {

  if (!opts.hasOwnProperty('xBlocks')) opts.xBlocks = 50;
  if (!opts.hasOwnProperty('yBlocks')) opts.yBlocks = 10;
  if (!opts.hasOwnProperty('translateX')) opts.translateX = 0;
  if (!opts.hasOwnProperty('translateY')) opts.translateY = 0;
  if (!opts.hasOwnProperty('translateZ')) opts.translateZ = -45;
  if (!opts.hasOwnProperty('rotateX')) opts.rotateX = -45;
  if (!opts.hasOwnProperty('rotateY')) opts.rotateY = 0;
  if (!opts.hasOwnProperty('rotateZ')) opts.rotateZ = 0;
  if (!opts.hasOwnProperty('color')) opts.color = [0.25, 0.25, 0.25, 1];
  if (!opts.hasOwnProperty('ambientColor')) opts.ambientColor = [0.5, 0.5, 0.5];
  if (!opts.hasOwnProperty('directionalLightColor')) opts.directionalLightColor = [0.5, 0.5, 0.5];
  if (!opts.hasOwnProperty('directionalLightVector')) opts.directionalLightVector = [1, -1, 0];
  if (!opts.hasOwnProperty('moveIncrement')) opts.moveIncrement = 0.01;
  if (!opts.hasOwnProperty('maxMove')) opts.maxMove = 1.0;
  if (!opts.hasOwnProperty('gradientTop')) opts.gradientTop = false;
  if (!opts.hasOwnProperty('gradientBottom')) opts.gradientBottom = false;
  if (!opts.hasOwnProperty('gradientLeft')) opts.gradientLeft = false;
  if (!opts.hasOwnProperty('gradientRight')) opts.gradientRight = false;
  if (!opts.hasOwnProperty('gradientBlocks')) opts.gradientBlocks = 0;
  if (!opts.hasOwnProperty('preset')) opts.preset = false;

  opts.xBlocks *= 2;

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

  var moving = [];
  var isMoving = [];
  var isNotMoving = [];

  this.setup = setup;
  this.setMove = setMove;
  this.move = move;

  generateMoving();
  function generateMoving() {
    var isLeft = true;
    for (var i = 0; i < opts.yBlocks; i++) {
      var points = [];
      for (var l = 0; l < opts.xBlocks; l++) {
        points.push({
          isLeft: isLeft,
          one: {index: 0, xIndex: l, yIndex: i, isLeft: isLeft, isMoving: false, isMovingUp: false, current: 0},
          two: {index: 1, xIndex: l, yIndex: i, isLeft: isLeft, isMoving: false, isMovingUp: false, current: 0},
          three: {index: 2, xIndex: l, yIndex: i, isLeft: isLeft, isMoving: false, isMovingUp: false, current: 0},
        })
        if (!isLeft) {
          isLeft = true;
        }
        else {
          isLeft = false;
        }
      }
      moving.push(points);
      for (var l = 0; l < points.length; l++) {
        isNotMoving.push(points[l].one);
        isNotMoving.push(points[l].two);
        isNotMoving.push(points[l].three);
      }
    }
  }

  function preset() {

    var count = isNotMoving.length;

    while (count > 0) {
      setMove();
      move();
      count--;
    }

  }

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  function radToDeg(rad) {
    return rad * (180 / Math.PI);
  }

  function generateVertices() {

    var currentX = -(opts.xBlocks / 2);
    var currentY = -(opts.yBlocks - 2);
    var currentIndex = 0;

    var changeSide = false;

    var gradientColors = [];
    var tempArray = [];
    for (var i = 0; i < opts.gradientBlocks; i++) {
      tempArray.push(opts.color[0]);
      tempArray.push(opts.color[1]);
      tempArray.push(opts.color[2]);
      tempArray.push((opts.color[3] / (opts.gradientBlocks + 1)) * (i + 1));
      gradientColors.push(tempArray);
      tempArray = [];
    }

    var setColor = [];

    for (var i = 0; i < opts.yBlocks; i++) {

      for (var l = 0; l < opts.xBlocks; l++) {

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

        if (opts.gradientBlocks > 0) {

          if (opts.gradientTop) {
            if (opts.gradientTop) {
              if (i > opts.yBlocks - opts.gradientBlocks) {
                setColor = gradientColors[opts.yBlocks - i];
              }
            }
          }

          if (opts.gradientBottom) {
            if (i < opts.gradientBlocks) {
              setColor = gradientColors[i];
            }
          }

          if (opts.gradientLeft) {

            if (l < opts.gradientBlocks * 2) {

              var tempL = Math.floor(l / 2);

              if (i < opts.gradientBlocks) {
                if (tempL < i) setColor = gradientColors[tempL];
              }

              if (i > opts.yBlocks - opts.gradientBlocks) {
                if (tempL < opts.yBlocks - i) setColor = gradientColors[tempL];
              }

              if (!setColor.length) {
                setColor = gradientColors[tempL];
              }

            }

          }

          if (opts.gradientRight) {

            if (l >= opts.xBlocks - (opts.gradientBlocks * 2)) {

              var tempL = Math.floor(l / 2);

              var index = Math.floor((l - (opts.xBlocks - (opts.gradientBlocks * 2))) / 2);
              index = opts.gradientBlocks - index;
              index -= 1;

              if (i < opts.gradientBlocks) {
                if ((opts.xBlocks / 2) - tempL - 1 < i) setColor = gradientColors[index];
              }
              if (i > opts.yBlocks - opts.gradientBlocks) {
                if ((opts.xBlocks / 2) - tempL - 1 < opts.yBlocks - i) setColor = gradientColors[index];
              }

              if (!setColor.length) setColor = gradientColors[index];

            }

          }

        }

        if (!setColor.length) setColor = opts.color;

        for (var j = 0; j < 3; j++) {
          colors = colors.concat(setColor)
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

        setColor = [];

      }

      currentX = -(opts.xBlocks / 2);
      currentY += 2;

    }

  }

  function setMove() {

    if (!isNotMoving.length) {
      return false;
    }

    var random = Math.floor(Math.random() * isNotMoving.length);

    var point = isNotMoving[random];
    var points = [];
    var index = point.index;
    var xIndex = point.xIndex;
    var yIndex = point.yIndex;

    if (point.isLeft) {

      if (index === 0) {
        points.push(moving[yIndex][xIndex].one);
        if (xIndex + 1 < opts.xBlocks) {
          points.push(moving[yIndex][xIndex + 1].one);
        }
        if (xIndex - 1 > -1) {
          points.push(moving[yIndex][xIndex - 1].two);
        }
        if ((xIndex - 1 > -1) && (yIndex + 1 < opts.yBlocks)) {
          points.push(moving[yIndex + 1][xIndex - 2].two);
          points.push(moving[yIndex + 1][xIndex - 1].three);
        }
        if (yIndex + 1 < opts.yBlocks) {
          points.push(moving[yIndex + 1][xIndex].three);
        }
      }

      if (index === 1) {
        points.push(moving[yIndex][xIndex].two);
        if (xIndex + 1 < opts.xBlocks) {
          points.push(moving[yIndex][xIndex + 1].three);
        }
        if (xIndex + 2 < opts.xBlocks) {
          points.push(moving[yIndex][xIndex + 2].three);
        }
        if ((xIndex + 2 < opts.xBlocks) && (yIndex - 1 > -1)) {
          points.push(moving[yIndex - 1][xIndex + 2].one);
          points.push(moving[yIndex - 1][xIndex + 3].one);
        }
        if (yIndex - 1 > -1) {
          points.push(moving[yIndex - 1][xIndex + 1].two);
        }
      }

      if (index === 2) {
        points.push(moving[yIndex][xIndex].three);
        if (xIndex - 1 > -1) {
          points.push(moving[yIndex][xIndex - 1].three);
          points.push(moving[yIndex][xIndex - 2].two);
        }
        if ((xIndex - 1 > -1) && (yIndex - 1 > -1)) {
          points.push(moving[yIndex - 1][xIndex - 1].two);
        }
        if (yIndex - 1 > -1) {
          points.push(moving[yIndex - 1][xIndex].one);
          points.push(moving[yIndex - 1][xIndex + 1].one);
        }
      }

    }
    else {

      if (index === 0) {
        points.push(moving[yIndex][xIndex].one);
        points.push(moving[yIndex][xIndex - 1].one);
        if (xIndex - 2 > -1) {
          points.push(moving[yIndex][xIndex - 2].two);
        }
        if ((xIndex - 2 > -1) && (yIndex + 1 < opts.yBlocks)) {
          points.push(moving[yIndex + 1][xIndex - 2].three);
          points.push(moving[yIndex + 1][xIndex - 3].two);
        }
        if (yIndex + 1 < opts.yBlocks) {
          points.push(moving[yIndex + 1][xIndex - 1].three);
        }
      }

      if (index === 1) {
        points.push(moving[yIndex][xIndex].two);
        if (xIndex + 1 < opts.xBlocks) {
          points.push(moving[yIndex][xIndex + 1].one);
          points.push(moving[yIndex][xIndex + 2].one);
        }
        if ((xIndex + 1 < opts.xBlocks) && (yIndex + 1 < opts.yBlocks)) {
          points.push(moving[yIndex + 1][xIndex + 1].three);
        }
        if (yIndex + 1 < opts.yBlocks) {
          points.push(moving[yIndex + 1][xIndex].three);
          points.push(moving[yIndex + 1][xIndex - 1].two);
        }
      }

      if (index === 2) {
        points.push(moving[yIndex][xIndex].three);
        points.push(moving[yIndex][xIndex - 1].two);
        if (xIndex + 1 < opts.xBlocks) {
          points.push(moving[yIndex][xIndex + 1].three);
        }
        if ((xIndex + 1 < opts.xBlocks) && (yIndex - 1 > -1)) {
          points.push(moving[yIndex - 1][xIndex + 1].one);
          points.push(moving[yIndex - 1][xIndex + 2].one);
        }
        if (yIndex - 1 > -1) {
          points.push(moving[yIndex - 1][xIndex].two);
        }
      }

    }

    for (var i = 0; i < points.length; i++) {
      if (!points[i].isMoving) {
        points[i].isMoving = true;
        points[i].isMovingUp = true;
        isMoving.push(isNotMoving.splice(isNotMoving.indexOf(points[i]), 1)[0]);
      }
    }

  }

  function move() {

    for (var i = isMoving.length - 1; i > -1; i--) {

      var point = isMoving[i];
      var indice = (point.xIndex * (3 * 3)) + (point.yIndex * (opts.xBlocks * (3 * 3)));

      if (point.isMovingUp) {
        point.current = point.current + opts.moveIncrement;
        if (point.current > opts.maxMove) {
          point.isMovingUp = false;
        }
      }
      else {
        point.current = point.current - opts.moveIncrement;
        if (point.current < 0) {
          point.current = 0;
          point.isMoving = false;
          isNotMoving.push(isMoving.splice(isMoving.indexOf(point), 1)[0]);
        }
      }

      if (point.index === 0) vertices[indice + 2] = point.current;
      if (point.index === 1) vertices[indice + 5] = point.current;
      if (point.index === 2) vertices[indice + 8] = point.current;

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

    if (typeof gl !== 'undefined') {
      initBuffers();
      drawScene();
    }

  }

  function setMatrixUniforms() {

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    mat4.toInverseMat3(mvMatrix, nMatrix);
    mat3.transpose(nMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, nMatrix);

    gl.uniform3fv(shaderProgram.ambientColorUniform, opts.ambientColor);
    gl.uniform3fv(shaderProgram.directionalLightColorUniform, opts.directionalLightColor);
    gl.uniform3fv(shaderProgram.directionalLightVectorUniform, opts.directionalLightVector);

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

    var str = shaderScript.innerHTML;

    var shader;
    if (shaderScript.id == 'fragmentShader') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shaderScript.id == 'vertexShader') {
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

    var fragmentShader = getShader(gl, 'fragmentShader');
    var vertexShader = getShader(gl, 'vertexShader');

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

    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, 'uAmbientColor');
    shaderProgram.directionalLightColorUniform = gl.getUniformLocation(shaderProgram, 'uDirectionalLightColor');
    shaderProgram.directionalLightVectorUniform = gl.getUniformLocation(shaderProgram, 'uDirectionalLightVector');

  }

  function initBuffers() {

    somethingVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    somethingVertexPositionBuffer.itemSize = 3;
    somethingVertexPositionBuffer.numItems = 3 * (opts.xBlocks * opts.yBlocks);

    somethingVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    somethingVertexColorBuffer.itemSize = 4;
    somethingVertexColorBuffer.numItems = 3 * (opts.xBlocks * opts.yBlocks);

    somethingVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, somethingVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    somethingVertexNormalBuffer.itemSize = 3;
    somethingVertexNormalBuffer.numItems = 3 * (opts.xBlocks * opts.yBlocks);

    somethingVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, somethingVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    somethingVertexIndexBuffer.itemSize = 1;
    somethingVertexIndexBuffer.numItems = 3 * (opts.xBlocks * opts.yBlocks);

  }

  function drawScene() {

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [opts.translateX, opts.translateY, opts.translateZ]);
    mat4.rotateX(mvMatrix, degToRad(opts.rotateX));
    mat4.rotateY(mvMatrix, degToRad(opts.rotateY));
    mat4.rotateZ(mvMatrix, degToRad(opts.rotateZ));

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

  function setup() {

    var canvas = document.getElementById(opts.id);

    var height = canvas.height;
    var width = canvas.width;

    generateVertices();

    if (opts.preset) {
      preset();
    }

    initGL(canvas);
    initShaders();
    initBuffers();

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    drawScene();

  }

}
