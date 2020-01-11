import FileLoader from '../resourceLoaders/fileLoader'
const ObjectLoader = require('webgl-obj-loader')

/**
 * TODO:
 * Change buffers to be a generic buffer
 * Typing of WebGLData
 */

interface WebGLData {
  indices: Array<number>
  vertices: Array<number>
  vertexNormals: Array<number>
  textures: Array<number>
}


class WebGLDataLoader {
  gl: any
  fileLoader: FileLoader

  constructor (gl: any, fileLoader: FileLoader) {
    this.gl = gl
    this.fileLoader = fileLoader
  }

  async createMesh(path): Promise<WebGLData> {
    const objectData = await this.fileLoader.load(path)
    return new ObjectLoader.Mesh(objectData)
  }
}
export {
  WebGLDataLoader
}