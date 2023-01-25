const express = require('express')
const app = express()
const { Marpit } = require('@marp-team/marpit')
const pptx = require('pptxgenjs')


function markdownToPPT(markdown) {
  // Create a new PowerPoint presentation
  const ppt = new pptx();

  // Split the markdown into lines
  const lines = markdown.split('\n');
  let slide = ppt.addSlide();

  //let the position slide
  let position = 0.00
  //set the text that is going to fill the slides
  let text=''

  // Iterate through each line
  for (let i = 0; i < lines.length; i++) {
    let line=''+lines[i]
    const tagType = ''+getMarkdownTag(line)
    
    
    if (line === "---") {
      position = 0.15
      // Add a new slide to the presentation
      slide = ppt.addSlide();
      continue;
    }



    // Add the line of markdown as text to the slide
    if (tagType=="list") {
      let nextTagType=''
      let lastTagType=''
      if (i < lines.length)  nextTagType=''+getMarkdownTag(lines[i+1]); 
      if (i < lines.length)  lastTagType=''+getMarkdownTag(lines[i-1]); 
      if (lastTagType!="list"){
        //find where the bullet point ends
        //text=trimMarkdownTag(tagType,line)
        let innerPosition =position
        //i++
        while( i < lines.length && "list"==getMarkdownTag(lines[i])){
          text+='\n'+trimMarkdownTag(tagType,lines[i])
          innerPosition += 0.25
          i++          
        }   

        slide.addText(text, getTagStyle(tagType, position));
        text=''
        innerPosition += 0.3
        position+=innerPosition
        i--
        continue;
      }  
      //text+='\n'+trimMarkdownTag(tagType,line)
      //position += 0.25
    }

    text=trimMarkdownTag(tagType,line)

    slide.addText(text, getTagStyle(tagType, position));
    text=''
    position += 0.25
  }

  console.log("WORK DONE")
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
- list item1.
* list item2.
+ list item3.
texto normal
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
  line=line+'';
  switch (true) {
    case line=="":
      return "";
    case line=="---":
      return "";
    case line.startsWith("######"):
      return "heading6";
    case line.startsWith("#####"):
      return "heading5";
    case line.startsWith("####"):
      return "heading4";
    case line.startsWith("###"):
      return "heading3";
    case line.startsWith("##"):
      return "heading2";
    case line.startsWith("#"):
      return "heading";
    case line.startsWith("*"):
      return "list";
    case line.startsWith("-"):
      return "list";
    case line.startsWith("+"):
      return "list";
    case line.startsWith("`"):
      return "code block";
    case line.startsWith("```"):
      return "code block";
    case line.startsWith("["):
      return "link";
    case line.startsWith("!["):
      return "image";
    default:
      return "";
  }
}

function getTagStyle(tag, position) {

  switch (tag) {
    case "":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 1.5,
        align: 'center',
        fontSize: 0,
        color: '000000',
        bullet: false,
        bold: false
      };
    case "heading":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 55,
        color: '000000',
        bullet: false,
        bold: false
      };
    case "heading2":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.4,
        align: 'center',
        fontSize: 50,
        color: '000000',
        bullet: false,
        bold: false
      };
    case "heading3":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 45,
        color: '000000',
        bullet: false,
        bold: false
      };
    case "heading4":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 40,
        color: '000000',
        bullet: false,
        bold: false
      };
    case "heading5":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 35,
        color: '000000',
        bullet: false,
        bold: false
      };
    case "heading6":
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 0.5,
        align: 'center',
        fontSize: 30,
        color: '000000',
        bullet: false,
        bold: false
      };
    case "list": 
      return {
        x: 0.0,
        y: position,
        w: '100%',
        h: 1.5,
        align: 'center',
        fontSize: 25,
        color: '000000',
        bullet: true,
        bold: false
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
        color: '000000',
        bullet: false,
        bold: false

      };
  }
}

function trimMarkdownTag(tag,line) {
  if (tag=="heading"||tag=="heading2"||tag=="heading3"||tag=="heading4"||tag=="heading5"||tag=="heading6") {
    return line.replace(/#/g, '');
  }
  if (tag=="list") {
    return line.replace(/^[-+*]/, '');
  }
  switch (tag) {
    default:
      return line;
  }
}

/// this process the style of (block quote) and (bold letters) italic also
function styleWrapper(tag) {
 //
  switch (tag) {
    case "code block":
      return "";
    case "code block":
      return "";
    default:
      //normal
      return "";
  }
}

//#endregion  

