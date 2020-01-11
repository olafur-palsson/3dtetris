class WebGLBuffers {
    index: Uint16Array
    vertex: Float32Array 
    texture: Float32Array
    normals: Float32Array

    constructor({ 
      indexBuffer,
      vertexBuffer,
      textureBuffer,
      normalBuffer
    }) {
      this.index = indexBuffer
      this.vertex = vertexBuffer
      this.texture = textureBuffer
      this.normals = normalBuffer
    }
}

export {
  WebGLBuffers
}