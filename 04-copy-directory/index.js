import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathToFolder = path.join(__dirname, 'files')
const pathToNewFolder = path.join(__dirname, 'files-copy');

(async () => {
  try {
    await fs.rm(pathToNewFolder, { force: true, recursive: true })
    await fs.mkdir(pathToNewFolder, { recursive: true })
    const files = await fs.readdir(pathToFolder, { withFileTypes: true })

    files.forEach(async (file) => {
      const pathFrom = path.join(pathToFolder, path.basename(file.name))
      const pathTo = path.join(pathToNewFolder, path.basename(file.name))
      await fs.copyFile(pathFrom, pathTo)
    })
  } catch (err) {
    console.error(err)
  }
})()