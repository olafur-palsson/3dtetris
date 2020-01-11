
import { Drawable } from '../drawables/drawable'
import { WebGLRenderLocations } from './models/renderLocations'
import { WebGLBuffers } from './models/buffers'

// TODO: Needs interfacing, too coupled to webgl when it can be just a model and a then implement some render interface

// Simple command to create buffers
// 'object' contains the data for the buffers
const N_BYTES = Float32Array.BYTES_PER_ELEMENT

export default class DrawableObject implements Drawable {
  gl: any
  locations: WebGLRenderLocations
  buffers: WebGLBuffers
  texture: any

  constructor (gl, locations: WebGLRenderLocations, buffers: WebGLBuffers, texture: any) {
    this.draw = this.draw.bind(this)
    this.locations = locations
    this.gl = gl
    this.buffers = buffers
    this.texture = texture
  }

  // Draws out the object on the center of the world
  // Use translation in shader to draw in a different place
  draw () {
    // Index buffer
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.index)

    // Vertex position buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.vertex)
    this.gl.vertexAttribPointer(this.locations.vertexPosition, 3, this.gl.FLOAT, false, 3 * N_BYTES, 0)
    this.gl.enableVertexAttribArray(this.locations.vertexPosition)

    // Texture coordinates buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texture)
    this.gl.vertexAttribPointer(this.locations.textureCoordinates, 2, this.gl.FLOAT, false, 0, 0)
    this.gl.enableVertexAttribArray(this.locations.textureCoordinates)

    // Vertex normals buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.normals)
    this.gl.vertexAttribPointer(this.locations.vertexNormals, 3, this.gl.FLOAT, false, 3 * N_BYTES, 0)
    this.gl.enableVertexAttribArray(this.locations.vertexNormals)

    // Set active texture and bind it
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
    this.gl.uniform1i(this.locations.textureSampler, 0)

    this.gl.drawElements(this.gl.TRIANGLES, this.buffers.index.length, this.gl.UNSIGNED_SHORT, 0)
  }
}

export {
  DrawableObject as GLObject
}