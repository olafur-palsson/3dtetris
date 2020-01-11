import { DrawableFactory } from '../drawables/drawablesFactory'
import { GLObject as WebGLObject } from './drawableObject'
import { WebGLRenderLocations as RendurLocations } from './models/renderLocations'
import { WebGLBuffers as BufferSet } from './models/buffers'
import { WebGLDataLoader as DataLoader } from './dataLoader'
import loadTexture from '../resourceLoaders/loadTexture'


enum BufferType {
  UINT,
  FLOAT
}

 
export default class DrawableObjectFactory implements DrawableFactory {

  gl: any
  locations: RendurLocations
  dataLoader: DataLoader

  constructor(gl, locations: RendurLocations, dataLoader: DataLoader) {
    this.gl = gl
    this.locations = locations
    this.dataLoader = dataLoader
  }

  async create(objectUrl: string, textureUrl: string) {
    const data = this.dataLoader.createMesh(objectUrl)
    const buffers = this.initializeBuffers(data)
    const texture = loadTexture(this.gl, textureUrl)
    return new WebGLObject(this.gl, this.locations, buffers, texture)
  }

  initializeBuffers(object): BufferSet {
    return new BufferSet({
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