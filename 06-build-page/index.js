import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathToTemplate = path.join(__dirname, 'template.html')
const pathToDistDir = path.join(__dirname, 'project-dist')
const pathToIndexFile = path.join(pathToDistDir, 'index.html')
const pathToStyleFile = path.join(pathToDistDir, 'style.css')
const pathToComponents = path.join(__dirname, 'components')
const pathToStylesDir = path.join(__dirname, 'styles')
const pathSrc = path.join(__dirname, 'assets')
const pathTarget = path.join(pathToDistDir, 'assets')

const createComponent = async () => {
  const rs = createReadStream(pathToTemplate, 'utf8')

  rs.on('data', async (data) => {
    const components = await fs.readdir(pathToComponents, { withFileTypes: true });

    components.forEach((component) => {
      if (typeCheck(component) === '.html') {
        const componentRStream = createReadStream(path.join(pathToComponents, component.name), 'utf8')

        componentRStream.on('data', (content) => {
          const componentName = path.basename(component.name, path.extname(component.name))
          const regex = new RegExp(`{{${componentName}}}`, 'g')
          data = data.replace(regex, content)
          createWriteStream(pathToIndexFile, 'utf8').write(data)
        })
        componentRStream.on('error', (err) => console.log(err))
      }

    })
  })

  rs.on('error', (err) => console.log(err))
}
// createComponent()

const createCss = async () => {
  try {
    const ws = createWriteStream(pathToStyleFile)
    const files = await fs.readdir(pathToStylesDir, { withFileTypes: true })

    files.forEach(async (file) => {
      if (typeCheck(file) === '.css') {
        const rs = createReadStream(path.join(pathToStylesDir, file.name))
        rs.on('data', (data) => ws.write(data))
        rs.on('error', (error) => console.log(error))
      }
    })

  } catch (err) {
    console.error(err)
  }
}
// createCss()

const copy = async () => {
  try {
    await fs.mkdir(pathTarget, { recursive: true })
    const files = await fs.readdir(pathSrc, { withFileTypes: true })

    files.forEach(async (file) => {
      if (file.isDirectory()) {
        await copy(path.join(pathSrc, file.name), path.join(pathTarget, file.name));
      } else {
        await fs.copyFile(path.join(pathSrc, path.basename(file.name)), path.join(pathTarget, path.basename(file.name)));
      }
    })
  } catch (err) {
    console.error(err)
  }
}

const buildFn = async () => {
  try {
    await fs.mkdir(pathToDistDir, { recursive: true })
    await createComponent()
    await createCss()
    await copy()
  } catch (err) {
    console.error(err)
  }
}
buildFn()


// helpers
function typeCheck(item) {
  return item.isFile() && path.extname(item.name)
}