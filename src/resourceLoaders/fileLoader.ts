export default interface FileLoader {
  // TODO: Change return type to be an actual file
  load(path: string): Promise<any>
}
