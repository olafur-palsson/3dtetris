import FileLoader from './fileLoader'


class LocalFileLoader implements FileLoader {
  async load (path: string) {
    throw new Error('Not implemented')
  }
}
