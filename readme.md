# polygon-sea
polygon sea

## Usage
```html
<script id='vertexShader' src='vertexShader.js' type='text/javascript'></script>
<script id='fragmentShader' src='fragmentShader.js' type='text/javascript'></script>

<script src='glMatrix-0.9.5.min.js' type='text/javascript'></script>
<script src='index.js' type='text/javascript'></script>

<canvas id='something' height='500' width='1000'></canvas>

<script type='text/javascript'>

var opts = {
  id: 'something',
  xBlocks: 10,
  yBlocks: 50,
  rotateX: -45,
  translateZ: -45,
  color: [0.25, 0.25, 0.25, 1],
  ambientColor: [0.5, 0.5, 0.5],
  directionalLightVector: [1, -1, 0],
  directionalLightColor: [0.5, 0.5, 0.5],
  moveIncrement: 0.01,
  maxMove: 1
};

var polygonSea = new PolygonSea(opts);
polygonSea.setup();

setInterval(polygonSea.setMove, 10);
setInterval(polygonSea.move, 25);

</script>
```

## API

### new PoloygonSea([opts]);
Create a new polygon sea object

#### [opts]
*Required* `Object`

###### id
*Required* `String`

The canvas element id attribute

###### xBlocks
`Number`

The number of blocks for the x plane

###### yBlocks
`Number`

The number of blocks for the y plane

###### rotateX rotateY rotateZ
`Number`

Rotation

###### translateX translateY translateZ
`Number`

Translation

###### color
`Array`

The color of the blocks

###### ambientColor
`Array`

The ambient light color

###### directionalLightVector
`Array`

The directional light vector

###### directionalLightColor
`Array`

The directional light color

###### moveIncrement
`Number`

The point move increment

###### maxMove
`Number`

The maximum distence that a point can move

### setup()
Setup the polygon sea

### setMove()
Set a point to move

### move()
Move points

## Install
`git clone https://github.com/egul/polygon-sea.git`

Move to project:  

index.js  
vertexShader.js  
fragmentShader.js  
glMatrix-0.9.5.min.js  

## License
MIT
