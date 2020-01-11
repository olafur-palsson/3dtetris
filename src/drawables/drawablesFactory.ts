import { Drawable } from './drawable'

interface DrawableFactory {
  create(url): Drawable
}

export {
  DrawableFactory
}