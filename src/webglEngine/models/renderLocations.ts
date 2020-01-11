class WebGLRenderLocations {
    vertexPosition: number 
    textureCoordinates: number 
    textureSampler: number
    vertexNormals: number

    constructor({ 
      vertexPositionAttribLocation,
      textCoordAttribLocation,
      u_samplerUniformLocation,
      normAttribLocation
    }) {
      this.vertexPosition = vertexPositionAttribLocation
      this.textureCoordinates = textCoordAttribLocation
      this.textureSampler = u_samplerUniformLocation
      this.vertexNormals = normAttribLocation
    }
}

export {
  WebGLRenderLocations
}