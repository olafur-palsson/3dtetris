
/*

  Copyright Olafur Palsson
  Email:   olafur.palsson2@gmail.com
  GitHUb:  olafur-palsson
  License: MIT

*/

const glMatrix = require('gl-matrix')

import { createWebGLProgram } from './easyWebGL'
import { loadTexture } from './textures'
import GLObject from './GLObject'
import addDragRotation from './dragRotatePlugin'
import { Tetris, TetrisBlock } from './tetris.js'

const vectorAdd = (v1, v2, scalar=1) => {
  let returnArray = []
  v1.forEach((_, i) => {
    returnArray.push(v1[i] + v2[i] * scalar)
  })
  return returnArray
}

let canvas, gl, program
const N_BYTES = Float32Array.BYTES_PER_ELEMENT

const start = async () => {
  canvas = document.getElementById('canvas')
  gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
  const program = await createWebGLProgram(gl, 'src/vertexShader.glsl', 'src/fragmentShader.glsl')
  const attribs = program.getAttribLocations('vertexPosition', 'vertexColor', 'a_textcoord', 'vertexNormals')
  gl.enable(gl.DEPTH_TEST)

  gl.clearColor(0.05, 0.05, 0.05, 1.0)

  program.addUniformLocation('mWorld',      gl.uniformMatrix4fv, false)
  program.addUniformLocation('mView',       gl.uniformMatrix4fv, false)
  program.addUniformLocation('mProjection', gl.uniformMatrix4fv, false)

  // Create arrays containing the actual matrices
  const mWorld        = new Float32Array(16)
  const mWorldInverse = new Float32Array(16)
  const mView         = new Float32Array(16)
  const mProjection   = new Float32Array(16)

  // Setup the camera matrix
  const positionOfViewer       = [ 0,  40, 15]
  const pointViewerIsLookingAt = [ 0,  0,  0]
  const vectorPointingUp       = [ 0,  5,  0]

  // Set up the world
  glMatrix.mat4.identity(mWorld)
  glMatrix.mat4.lookAt(mView, positionOfViewer, pointViewerIsLookingAt, vectorPointingUp )
  glMatrix.mat4.perspective(mProjection, Math.PI * 0.25, canvas.width / canvas.height, 0.1, 1000.0)

  program.setUniforms({ mView, mWorld, mProjection })

  // Set up GLObject 
  const u_samplerUniformLocation = gl.getUniformLocation(program.program, 'u_sampler')

  GLObject.setProgramLocations(
    attribs.vertexPosition, 
    attribs.a_textcoord, 
    u_samplerUniformLocation, 
    attribs.vertexNormals
  )
  // Enable click and draw rotation
  const rotate_wrt_time = addDragRotation(mWorld, mWorldInverse)

  // Get some uniform locations from the vertex/fragment shader
  program.addUniformLocation('translation', gl.uniform3fv)
  program.addUniformLocation('orientation', gl.uniformMatrix4fv, false)
  program.addUniformLocation('scalar', gl.uniform1f)
  program.addUniformLocation('ambientScalar', gl.uniform1f)
  program.addUniformLocation('lightPos', gl.uniform3fv)
  program.addUniformLocation('lightColor', gl.uniform3fv)
  program.addUniformLocation('viewDirection', gl.uniform3fv)
  program.addUniformLocation('mWorldInverse', gl.uniformMatrix4fv, false)
  program.addUniformLocation('color', gl.uniform3fv)

  // Set up lighting
  const lightPos = new Float32Array([-10, 0, -10])
  const viewDirection = new Float32Array(3)
  glMatrix.vec3.normalize(viewDirection, positionOfViewer)

  program.setUniforms({ 
    lightColor: new Float32Array([1, 1, 1]), 
    viewDirection,
    lightPos
  })

  const identity = glMatrix.mat4.identity(new Float32Array(9))

  const orientation = new Float32Array(16)

  // Create the objects we will draw
  const sun = await GLObject.create(gl, 'sphere.obj', 'sun.png')
  const block = await GLObject.create(gl, 'block.obj', 'moon.png')

  // Create the data to render the sun
  const sunObj = {
    objectId: -1,
    location: [-50, 0.0, 0.0],
    velocity: [0, 0, 0],
    size: 15,
    swimSeed: 0,
    swimStatus: 0,
  }

  TetrisBlock.program = program
  TetrisBlock.GLObject = block
  const tetris = new Tetris()

  tetris.startGame()
  tetris.bindKeys()


  // TODO:
  //  Add simple rotation with only 
  //  Add keybindings
  let i = -10
  let lastTime = performance.now()
  const render = () => {
    // if (i++ > 0) return

    // Get the time between frames
    let currentTime = performance.now()
    let timePassed = currentTime - lastTime
    lastTime = currentTime

    // Calculate a one game tick
    rotate_wrt_time(timePassed)
    program.setUniforms({ mView, mWorld, mWorldInverse, ambientScalar: 0.1, scalar: 0.5 })

    // Clear and draw objects
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    tetris.render()

    // Calculate variables for the sun
    glMatrix.mat4.targetTo(orientation, lightPos, vectorAdd(lightPos, [1,0,0]), vectorPointingUp)
    const translation = new Float32Array([10, 0, 10])
    const color = new Float32Array([1, 1, 1])
    program.setUniforms({ orientation, translation, scalar: 3, ambientScalar: 1.5, color })
    sun.draw()

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

start()
