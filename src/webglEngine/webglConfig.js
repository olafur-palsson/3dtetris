const positionOfViewer       = [ 0,  20, 15]
const pointViewerIsLookingAt = [ 0,  0,  0]
const vectorPointingUp       = [ 0,  5,  0]

export default {
  initialPositions: {
    positionOfViewer,
    pointViewerIsLookingAt,
    vectorPointingUp
  },
  clearColor: [0.05, 0.05, 0.05, 1.0],
  canvasElementId: 'canvas',
  dephtTest: true,
  preserveDrawingBuffer: false,
  attributeLocations: {
    vertexPosition: 'vertexPosition',
    vertexColor: 'vertexColor',
    textureCoordinates: 'a_textcoord',
    vertexNormals: 'vertexNormals'
  },
  uniformLocations: {
    objectUniforms: {
      translation: 'translation',
      orientation: 'orientation',
      color: 'color',
      scale: 'scalar',
    },
    lightUniforms: {
      ambientScale: 'ambientScalar',
      lightPosition: 'lightPos',
      lightColor: 'lightColor',
    },
    world: {
      viewDirection: 'viewDirection',
      worldInverse: 'mWorldInverse'
    }
  },
  shaders: {
    vertex: 'src/vertexShader.glsl',
    fragment: 'src/fragmentShader.glsl'
  },
  initial: {
    light: {
      position: new Float32Array([10, 10, 0])
    }
  }

}