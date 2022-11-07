import fs from 'fs/promises'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathToFolder = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await fs.readdir(pathToFolder, { withFileTypes: true })
    files.forEach(async (file) => {
      if (file.isFile()) {
        const name = file.name
        const type = path.extname(name)
        const size = (await fs.stat(path.join(pathToFolder, name))).size
        console.log(`${name.replace(type, '')} - ${type.replace('.', '')} - ${formatBytes(size, 3)}`)
      }
    })
  } catch (err) {
    console.error(err)
  }
}
)()


//helpers
function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const K = 1024
  const DM = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(K))
  return `${parseFloat((bytes / Math.pow(K, i)).toFixed(DM))} ${sizes[i]}`
}