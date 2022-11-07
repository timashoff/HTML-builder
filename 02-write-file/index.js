import fs from 'fs'
import url from 'url'
import path from 'path'
import { stdin } from 'process'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathToFile = path.join(__dirname, 'text.txt')

const ws = fs.createWriteStream(pathToFile, 'utf-8')
console.log('Hello there, write me something... \n')

stdin.on('data', (data) => {
  if (checkExit(data)) exitFn()
  ws.write(data)
})

process.on('SIGINT', exitFn)  // ctrl+c


//helpers
function exitFn() {
  console.log(`
It's been added to file: '${path.basename(pathToFile)}'
Bye for now!`)
  process.exit()
}

function checkExit(d) {
  const exit = d.toString().trim()
  return exit === 'exit' || exit === '.exit' || exit === '/exit'
}

