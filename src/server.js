const express = require('express')
const app = express()
const {Marpit} = require('@marp-team/marpit')
//import {Marpit} from 'marp-team/marpit'
//const theme = require('./variables.js')
//const {theme,markdown} = require('./variables.js')
import { theme,markdown } from './variables.js'

app.get('/', function (req, res) {

  const marpit = new Marpit()

  // 2. Add theme CSS

  marpit.themeSet.default = marpit.themeSet.add(theme)

  // 3. Render markdown
 
  const { html, css } = marpit.render(markdown)

  // 4. Use output in your HTML
  const htmlFile = `
<!DOCTYPE html>
<html><body>
  <style>${css}</style>
  ${html}
</body></html>
`
  //fs.writeFileSync('example.html', htmlFile.trim())
  res.send(htmlFile.trim()) // this sends the mesage
})

app.listen(3000)