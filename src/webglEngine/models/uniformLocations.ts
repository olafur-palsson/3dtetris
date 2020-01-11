interface Location {
  setter(args: any): void
  location: number
}

class UniformLocations {
  gl: any
  program: any
  uniformLocations: object

  constructor (gl, program) {
    this.uniformLocations = {}
    this.program = program
    this.setUniforms = this.setUniforms.bind(this)
  }

  addUniformLocation(name, setter, thirdArg='undefined') {
    const location = this.gl.getUniformLocation(this.program, name)
    setter = setter.bind(this.gl)
    let createSetter = () => {
      if (typeof thirdArg != 'undefined')
        return value => { setter(location, thirdArg, value) }
      else
        return value => { setter(location, value) }
    }
    this.uniformLocations[name] = { location, setter: createSetter() }
  }

  getUniformLocations () {
    return Object.keys(this.uniformLocations).reduce(
      (obj, name) => obj[name] = this.uniformLocations[name].location,
      {})
  }

  setUniforms (objectOfVars) {
    for (let key in objectOfVars)
      this.uniformLocations[key].setter(objectOfVars[key])
  }
}