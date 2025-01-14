import fs from 'fs'
import url from 'url'
import path from 'path'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathToFile = path.join(__dirname, 'text.txt')

const rs = fs.createReadStream(pathToFile)
rs.on('data', (data) => console.log(data.toString()))
rs.on('error', (err) => console.log(err))