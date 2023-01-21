const express = require('express')
const app = express()
const {Marpit} = require('@marp-team/marpit')
const pptx = require ('pptxgenjs')


function markdownToPPT(markdown) {
  // Create a new PowerPoint presentation
  const ppt = new pptx();

  // Split the markdown into lines
  const lines = markdown.split('\n');

  // Iterate through each line
  for (const line of lines) {
    // Add a new slide to the presentation
    const slide = ppt.addSlide();

    //when finds a -------- iterates
    
    // Add the line of markdown as text to the slide
    slide.addText(line);
  }
  console.log("AAAAAAAAAAAAAH")
  // Download the PowerPoint presentation
  ppt.writeFile();
}


app.get('/', function (req, res) {

  const marpit = new Marpit()

  // 2. Add theme CSS
  const theme = `
/* @theme example */

section {
  background-color: #369;
  color: #fff;
  font-size: 30px;
  padding: 40px;
}

h1,
h2 {
  text-align: center;
  margin: 0;
}

h1 {
  color: #8cf;
}
`


  marpit.themeSet.default = marpit.themeSet.add(theme)

  // 3. Render markdown
  const markdown = `

# Hello, Marpit!

Marpit is the skinny framework for creating slide deck from Markdown.

---

## Ready to convert into PDF!

You can convert into PDF slide deck through Chrome.

`
 
  const { html, css } = marpit.render(markdown)

  // 4. Use output in your HTML
  const htmlFile = `
<!DOCTYPE html>
<html><body>
  <style>${css}</style>
  ${html}
</body></html>
`
markdownToPPT(markdown)
//fs.writeFileSync('example.html', htmlFile.trim())
  res.send(htmlFile.trim()) // this sends the mesage
})

app.listen(3000)