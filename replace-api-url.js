import fs from 'fs'
import path from 'path'

const outputDir = path.join(process.cwd(), 'dist')

function updateImageUrls(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const updatedContent = content.replaceAll(
    'https://api.skiercon.pl/static/',
    '/api-img/'
  )
  console.log('Updating image URLs in:', filePath)
  fs.writeFileSync(filePath, updatedContent)
}

function processHtmlFiles(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err)
      return
    }

    files.forEach(file => {
      const filePath = path.join(directory, file)

      if (fs.statSync(filePath).isDirectory()) {
        processHtmlFiles(filePath)
      } else if (
        path.extname(file) === '.html' ||
        path.extname(file) === '.js'
      ) {
        updateImageUrls(filePath)
      }
    })
  })
}

processHtmlFiles(outputDir)
