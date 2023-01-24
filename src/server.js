const express = require('express')
const app = express()
const {Marpit} = require('@marp-team/marpit')
const pptx = require ('pptxgenjs')


function markdownToPPT(markdown) {
  // Create a new PowerPoint presentation
  const ppt = new pptx();

  // Split the markdown into lines
  const lines = markdown.split('\n');
  let slide = ppt.addSlide();
  
  //let the position slide
  let position=0.00

  // Iterate through each line
  for (const line of lines) {
    
    
    if (line==="---") {
      position=0.15
      // Add a new slide to the presentation
      slide = ppt.addSlide();  
      continue;
    }  

    /// be aware of the start and beguining of  ` and ``` style wrapper

    const tagType= getMarkdownTag(line)
    // Add the line of markdown as text to the slide
    slide.addText(line,getTagStyle(tagType,position));
    position+=0.25
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
---
- Revenue was off the chart.

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
  res.send(htmlFile.trim()) // this sends the mesage
})

app.listen(3000)



//#region OPTIONS STYLES

function getMarkdownTag(line) {
  switch (true) {
    case line.startsWith("#"):
      return "heading";
    case line.startsWith("##"):
      return "heading2";
    case line.startsWith("###"):
      return "heading3";
    case line.startsWith("####"):
      return "heading4";
    case line.startsWith("#####"):
      return "heading5";
    case line.startsWith("######"):
      return "heading6";
    case line.startsWith("*"):
      return "list item";
    case line.startsWith("`"):
      return "code block";
    case line.startsWith("```"):
      return "code block";
    case line.startsWith("["):
      return "link";
    case line.startsWith("-"):
      return "bullet point";
    case line.startsWith("!["):
      return "image";
    default:
      return "none";
  }
}

function getTagStyle(tag, position) {

  switch (tag) {
    case "heading":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 55,
        color: '000000'
      };
    case "heading2":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 50,
        color: '000000'
      };
    case "heading3":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 45,
        color: '000000'
      };
    case "heading4":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 40,
        color: '000000'
      };
    case "heading5":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 35,
        color: '000000'
      };
    case "heading6":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 30,
        color: '000000'
      };
      case "bullet point":
        return {
          x: 0.0,
          y: position,
          w: '100%',
          h: 0.5,
          align: 'center',
          fontSize: 30,
          color: '000000',
          bullet: true
        };
    default:
      //normal
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 1.5,
        align: 'center',
        fontSize: 25,
        color: '000000'
      };
  }
}

function trimMarkdownTag(tag) {

}

//#endregion  

