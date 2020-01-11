import UrlFileLoader from "../resourceLoaders/urlFileLoader"

/*

  Copyright Olafur Palsson
  Email:   olafur.palsson2@gmail.com
  GitHUb:  olafur-palsson
  License: MIT

*/
const glMatrix = require('gl-matrix')
class WebGLProgram {

  shaderLoc: object
  gl: any
  program: any
  attribLocations: AttributeLocations
  uniformLocations: UniformLocations
  
  async init (webglContext, vertexShaderUrl, fragmentShaderUrl) {
    this.gl = webglContext
    const loader = new UrlFileLoader()
    const vertexShaderSource = await loader.load(vertexShaderUrl)
    const fragmentShaderSource = await loader.load(fragmentShaderUrl)
    await this.createProgram(vertexShaderSource, fragmentShaderSource)
    this.gl.useProgram(this.program)
    this.attribLocations = new AttributeLocations(this.gl, this.program)
    this.uniformLocations = new UniformLocations(this.gl, this.program)
  }

  // This is how you get the compile errors of a shader displayed in console
  verifyShaderCompilation (gl, shader) {
    const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if ( !ok )
    throw "ShaderCompileError: \n" + gl.getShaderInfoLog(shader)
  }

  // This is how you get the linking errors of the program displayed in console
  verifyProgramLinking (gl, program) {
    const ok = gl.getProgramParameter(program, gl.LINK_STATUS)
    if ( !ok )
    throw "ProgramLinkingError: \n" + gl.getProgramInfoLog(program)
  }

  createProgram (vertexShaderSource, fragmentShaderSource) {

    // Set the background or null color and clear
    this.gl.clearColor(0, 0, 0, 1)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

    // Create shader
    const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
    const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)

    // Set the source code for the shader
    this.gl.shaderSource(vertexShader, vertexShaderSource)
    this.gl.shaderSource(fragmentShader, fragmentShaderSource)

    // Compile
    this.gl.compileShader(vertexShader)
    this.gl.compileShader(fragmentShader)

    // Get shader compile errors displayed in console
    this.verifyShaderCompilation(this.gl, vertexShader)
    this.verifyShaderCompilation(this.gl, fragmentShader)

    // Create and link the program
    this.program = this.gl.createProgram()
    this.gl.attachShader(this.program, vertexShader)
    this.gl.attachShader(this.program, fragmentShader)
    this.gl.linkProgram(this.program)

    // Get linking errors
    this.verifyProgramLinking(this.gl, this.program)
    return this.program
  }

  // TODO: This makes it a 3 stage initialization
  setupUniformMatrices (aspectRatio, positionOfViewer, pointViewerIsLookingAt, vectorPointingUp) {
    const mWorld = new Float32Array(16);
    const mView = new Float32Array(16);
    const mProj = new Float32Array(16);

    const {
      matWorldUniformLocation,
      matViewUniformLocation,
      matProjUniformLaction
    } = this.uniformLocations.getUniformLocations()

    glMatrix.mat4.identity(mWorld)
    glMatrix.mat4.lookAt(mView, positionOfViewer,  pointViewerIsLookingAt, vectorPointingUp)
    glMatrix.mat4.perspective(mProj, Math.PI * 0.25, aspectRatio, 0.1, 1000.0)

    this.gl.uniformMatrix4fv(matViewUniformLocation, this.gl.FALSE, mView)
    this.gl.uniformMatrix4fv(matWorldUniformLocation, this.gl.FALSE, mWorld)
    this.gl.uniformMatrix4fv(matProjUniformLaction, this.gl.FALSE, mProj)

    return { mWorld, mView, mProj }
  }
}

let createWebGLProgram = async (webglContext, vertexShaderUrl, fragmentShaderUrl) => {
  let obj = new WebGLProgram()
  await obj.init(webglContext, vertexShaderUrl, fragmentShaderUrl)
  return obj
}

export {
  createWebGLProgram
}

