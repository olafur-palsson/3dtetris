import { DrawableFactory } from '../drawables/drawablesFactory'
import { GLObject as WebGLObject } from './glObject'
import { WebGLLocations } from './models/webglLocations'
import { WebGLBuffers as WebGLBufferSet } from './models/webglBuffers'
import { WebGLDataLoader } from './webglDataLoader'


enum BufferType {
  UINT,
  FLOAT
}

 
export default class WebGLObjectFactory implements DrawableFactory {

  gl: any
  locations: WebGLLocations
  dataLoader: WebGLDataLoader

  constructor(gl, locations: WebGLLocations, dataLoader: WebGLDataLoader) {
    this.gl = gl
    this.locations = locations
    this.dataLoader = dataLoader
  }

  async create(objectUrl: string, textureUrl: string) {
    const data = this.dataLoader.createMesh(objectUrl)
    const buffers = this.initializeBuffers(data)
    const texture

    object.mesh = await getObject(gl, objectUrl)
    object.buffers = createBuffers(gl, object.mesh)
    object.texture = loadTexture(gl, textureUrl)
    object.gl = gl
    object.numItems = object.mesh.indices.length
    return new WebGLObject()
  }

  initializeBuffers(object): WebGLBufferSet {
    return new WebGLBufferSet({
      textureBuffer: this.createFloatBuffer(object.textures),
      normalBuffer: this.createFloatBuffer(object.vertexNormals),
      vertexBuffer: this.createFloatBuffer(object.vertices),
      indexBuffer: this.createUintBuffer(object.indices)
    })
  }

  createBuffer(data, bufferType: BufferType) {
    if (bufferType == BufferType.FLOAT)
      return this.createFloatBuffer(data)
    else
      return this.createUintBuffer(data)
  }

  createFloatBuffer(data) {
    const buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW)
    return buffer
  }

  createUintBuffer(data) {
    const buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.createFloatBuffer(this.gl.ARRAY_BUFFER, new Uint16Array(data), this.gl.STATIC_DRAW)
    return buffer
  } 
}