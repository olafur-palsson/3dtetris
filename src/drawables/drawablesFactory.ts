import { Drawable } from './drawable'

interface DrawableFactory {
  create(objectUrl, textureUrl): Promise<Drawable>
}

export {
  DrawableFactory
}