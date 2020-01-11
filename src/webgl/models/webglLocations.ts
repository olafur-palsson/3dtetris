class WebGLLocations {
    vertexPosition: number 
    textureCoord: number 
    textureSampler: number
    vertexNorms: number

    constructor({ 
      vertexPositionAttribLocation,
      textCoordAttribLocation,
      u_samplerUniformLocation,
      normAttribLocation
    }) {
      this.vertexPosition = vertexPositionAttribLocation
      this.textureCoord = textCoordAttribLocation
      this.textureSampler = u_samplerUniformLocation
      this.vertexNorms = normAttribLocation
    }
}

export {
  WebGLLocations
}