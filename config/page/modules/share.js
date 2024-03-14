const pageCommon = require('../common')

const { newPage } = pageCommon

const pages = [
  newPage({
    title: 'PersonaAI: Discover Your Depths',
    template: `src/pages/share/index.html`,
    filename: `share/index.html`,
    chunks: ['share'],
    cdnModules: ['vue', 'axios'],
  })
]

module.exports = [
  ...pages
]
