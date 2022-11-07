import { createReadStream, createWriteStream } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pathToTemplate = path.join(__dirname, 'template.html')
const pathToDistDir = path.join(__dirname, 'project-dist')
const pathToIndexFile = path.join(pathToDistDir, 'index.html')
const pathToComponents = path.join(__dirname, 'components')

const createComponent = async () => {
  const rs = createReadStream(pathToTemplate, 'utf8')

  rs.on('data', async (data) => {
    const components = await fs.readdir(pathToComponents, { withFileTypes: true });

    components.forEach((component) => {

      if (component.isFile() && path.extname(component.name) === '.html') {
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

createComponent()
