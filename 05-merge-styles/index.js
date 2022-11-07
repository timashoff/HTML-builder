import { createReadStream, createWriteStream } from 'fs'
import { readdir } from 'fs/promises'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathToFolder = path.join(__dirname, 'styles')
const pathToDistFile = path.join(__dirname, 'project-dist/bundle.css');

(async () => {
  try {
    const ws = createWriteStream(pathToDistFile);
    const files = await readdir(pathToFolder, { withFileTypes: true })

    files.forEach(async (file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const rs = createReadStream(path.join(pathToFolder, file.name))
        rs.on('data', (data) => ws.write(data))
        rs.on('error', (error) => console.log(error))
      }
    })

  } catch (err) {
    console.error(err)
  }
})()