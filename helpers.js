// const { select } = require('./cliSelect.js')
const fs = require('fs')
const input = require('input')
const currentPath = process.cwd()
const configFileName = '.svgrc'
const path = require('path')
const configPath = path.resolve(currentPath, "svg-inliner.json")

const DEFAULT_CONFIG = {
  createHtml: undefined,
  exportType: undefined,
}

module.exports = {
  getUserSettings: async () => {

    let config = DEFAULT_CONFIG

    // load config if exists
    if(fs.existsSync(configPath)) {

      let file = fs.readFileSync(configPath)
      let data = JSON.parse(file);

      // asign loaded values
      for (var key in data) {
        config[key] = data[key]
      }
    }

    let prevConfig = Object.assign({}, config) // create object copy for detecting changes

    // get option for export type
    if(config.exportType === undefined) {
      const options = [
        { name: 'React Component', value: 'react_component' },
        { name: 'String', value: 'string' },
      ]
      const selectedOption = await input.select('Export as ', options)
      config.exportType = selectedOption
    }

    // get option for documentation generation
    if(config.createHtml === undefined) {
      const options = [
        { name: 'Generate HTML', value: true },
        { name: 'Skip Generation', value: false },
      ]
      const selectedOption = await input.select('Generate Documentation:', options)
      config.createHtml = selectedOption
    }

    // save config if changed
    if(prevConfig != config) {
      fs.writeFileSync(configPath, JSON.stringify(config))
    }

    return config
  },
  toPascalCase: (string) => {
    return `${string}`
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w+)/, 'g'),
        ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
      )
      .replace(new RegExp(/\s/, 'g'), '')
      .replace(new RegExp(/\w/), s => s.toUpperCase())
  }
}
