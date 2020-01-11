import FileLoader from './fileLoader'


export default class UrlFileLoader implements FileLoader {
  
  async load (path: string) {
    return this.getFileFromURL(path)
  }
  
  async getFileFromURL(url: string) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.onload = () =>  {
        resolve(req.responseText)
      }
      req.open("GET", url);
      req.onerror = () => {
        reject(url + " did not load bro")
      }
      req.send();
    })
  }
}
