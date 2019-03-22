
// Creates a single square block
class TetrisBlock {
  // Color is a essentially a filter for the texture should be a 3-float vector of values in [0.0; 1.0]
  // Position should be a 3-int vector of [0, 5], [0, 20], [0, 5]
  //
  // Requires: 
  //  EasyWebGL as a static variable
  //  GLObject as static variable
  constructor (color) {
    this.color = color
    this.shouldDraw = true
  }

  draw (translation) {
    const color = new Float32Array(this.color)
    // TetrisBlock.program.setUniforms(translation, color)
    TetrisBlock.program.setUniforms({ translation, color })
    if (this.shouldDraw) {
      TetrisBlock.GLObject.draw()
    }
  }
}


let uparrow = 38
let lfarrow = 37
let rgarrow = 39
let dnarrow = 40

let space = 32
let comma = 188
let semic = 59
let dot = 190
let a = 65
let o = 79
let e = 69
let q = 81
let j = 74
let h = 72
let t = 84
let n = 78
let s = 83
let u = 85
let w = 87
let r = 82
let y = 89

// TODO:
//  Out of bounds function
//  Move left
//  Move right
//  Move front
//  Move back
//  Layer is full
//  Points
//  Restart
//  Speed up
class Tetris {

  constructor () {
    // Initialize the game array with false
    // this array will be populated with GLObjects to render
    // layer = y, row = z, col = x as per normal webgl coordinates
    this.blocks = new Array(20).fill(false).map(layer => 
      new Array(6).fill(false).map(row =>
        new Array(6).fill(false)
      )
    )
    this.render = this.render.bind(this)
    this.endGame = this.endGame.bind(this)
    this.startGame = this.startGame.bind(this)
    this.clockTick = null
    this.bindKeys = this.bindKeys.bind(this)
  }

  bindKeys () {
    document.onkeydown = kbdEvent => {
      switch(kbdEvent.which) {
        case uparrow: this.moveRow(-1); break;
        case dnarrow: this.moveRow(1); break;
        case rgarrow: this.moveCol(1); break;
        case lfarrow: this.moveCol(-1); break;
        case space  : this.moveAllTheWayDown(); break;
      }
    }
  }

  forAll (doThis) {
    this.blocks.forEach(layer => {
      layer.forEach(row => {
        row.forEach(block => {
          if (block)
            doThis(block)
        })
      })
    })
  }

  reset () {
    this.blocks.forEach(layer => {
      layer.forEach((row, i) => {
        row[i] = false
      })
    })
  }

  startGame () {
    this.createBlock();
    this.clockTick = setInterval(() => {
      this.moveDown()
    }, 200)
  }

  endGame () {
    console.log('You suck  lost bruuuuuuuh!')
    let out = -5
    window.clearInterval(this.clockTick)
    const interval = setInterval(() => {
      if (out++ >= 0) {
        window.clearInterval(interval)
      }
      this.forAll(block => {
        block.shouldDraw = !block.shouldDraw
      })
    }, 500)
  }

  createBlock () {
    if (this.blocks[19][3][3] || this.blocks[19][3][2]) {
      window.clearInterval(this.clockTick)
      this.endGame()
    }
    const rand = parseInt(Math.random() * 3) + 2
    const x = rand
    const isStraight = x == 3
    const z = isStraight ? 4 : 3

    let color = [Math.random(), Math.random(), Math.random()];

    const blockPositions = [[3, 19, 3], [3, 19, 2], [x, 19, z]]
    blockPositions.forEach(position => {
      const [x, y, z] = position
      this.blocks[y][z][x] = new TetrisBlock(color)
    })

    this.currentBlockPositions = blockPositions
  }

  render () {
    this.blocks.forEach((layer, y) => {
      layer.forEach((row, z)=> {
        row.forEach((block, x) => {
          if (block)
            block.draw(new Float32Array([x, y, z]))
        })
      })
    })
  }

  moveAllTheWayDown () {
    while (this.canMoveDown(this.currentBlockPositions))
      this.moveDown(this.currentBlockPositions)
    this.createBlock()
  }

  popCurrentBlocks () {
    return this.currentBlockPositions.map(pos => {
      let [x, y, z] = pos
      const block = this.blocks[y][z][x]
      this.blocks[y][z][x] = false
      return block
    })
  }

  moveCol (n) {
    // console.log('Moving COL by ' + n)
    if (!this.canMoveCol(n))
      return
    const blocksToMove = this.popCurrentBlocks()
    const nextBlockPositions = [] 
    this.currentBlockPositions.forEach((position, i) => {
      let [x, y, z] = position
      this.blocks[y][z][x+n] = blocksToMove[i]
      nextBlockPositions.push([x+n, y, z])
    })
    this.currentBlockPositions = nextBlockPositions
  }

  moveRow (n) {
    // console.log('Moving ROW by ' + n)
    if (!this.canMoveRow(n))
      return
    const blocksToMove = this.popCurrentBlocks()
    const nextBlockPositions = [] 
    this.currentBlockPositions.forEach((position, i) => {
      let [x, y, z] = position
      this.blocks[y][z+n][x] = blocksToMove[i]
      nextBlockPositions.push([x, y, z+n])
    })
    this.currentBlockPositions = nextBlockPositions
  }


  moveDown () {
    if (!this.canMoveDown()) {
      this.createBlock()
      return
    }

    const blocksToMove = this.popCurrentBlocks()
    const nextBlockPositions = []
    this.currentBlockPositions.forEach((position, i) => {
      let [x, y, z] = position
      this.blocks[y-1][z][x] = blocksToMove[i]
      nextBlockPositions.push([x, y-1, z])
    })
    this.currentBlockPositions = nextBlockPositions
  }

  canMove (n, xyzAs012, max) {
    let isPossible = true
    let outOfBounds = false
    let currentBlocks = this.currentBlockPositions.map(pos => {
      const [x, y, z] = pos
      return this.blocks[y][z][x]
    })
    this.currentBlockPositions.forEach(position => {
      let nextPos = position.slice()
      nextPos[xyzAs012] += n
      a = nextPos[xyzAs012] 
      let [x, y, z] = nextPos
      // Value says if there is a block at position [x, y, z] that is not part of the currently falling block
      if (xyzAs012 != 1) console.log("try move", position, n)
      if (x > 5 || x < 0 || y < 0 || z > 5 || z < 0) {
        console.log("BLOCKED -- OUT OF BOUNDS")
        outOfBounds = true
      } else if (this.blocks[y][z][x]) {
        isPossible = false
        const blockingBlock = this.blocks[y][z][x]
        currentBlocks.forEach(block => { 
          if (block == blockingBlock) { 
            isPossible = true 

          } 
        })
      }
    })
    return isPossible && !outOfBounds
  }

  // Magic constants: 0=x, 1=y, 2=z
  canMoveRow (n) { return this.canMove(n, 2, 5) }
  canMoveCol (n) { return this.canMove(n, 0, 5) }
  canMoveDown () { return this.canMove(-1, 1, 19) }
}

export {
  Tetris,
  TetrisBlock
}
