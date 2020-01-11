class AttributeLocations {
  cachedLocations: object
  gl: any
  program: any

  constructor (gl, program) {
    this.cachedLocations = {}
    this.gl = gl
    this.program = program
  }

  getAttribLocations(...arrayOfAttribNames) {
    return arrayOfAttribNames.reduce((obj, name) => obj[name] = this.get(name), {})
  }

  get(name: string) {
    if (name in this.cachedLocations)
      return this.cachedLocations[name]
    else
      return this.gl.getAttribLocation(this.program, name)
  }

}

