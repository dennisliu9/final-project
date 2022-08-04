import React from 'react';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/plugins/custom-class/prism-custom-class';
import DOMPurify from 'dompurify';

// prefix all Prism output classes to avoid collisions with Bulma
Prism.plugins.customClass.prefix('prism-');

// Set options for marked
marked.setOptions({
  highlight: (code, lang) => {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang); // like Prism.highlight(sampleCode, Prism.languages.javascript, 'javascript')
    } else {
      // If the grammar is not installed/recognized, just return the code as is
      return code;
    }
  }
});

export default class MarkdownBox extends React.Component {
  // receives following props
  // elementType: 'textMd',
  // elementId: this.state.nextElementId,
  // startingPoint: mouseLocation,
  // width: this.state.markdownBoxDimensions[0],
  // height: this.state.markdownBoxDimensions[1],
  // userInput: '',
  // render: false

  render() {

    const { elementId, startingPoint, width, height, userInput, render, handleChange } = this.props;
    const userInputHTMLClean = DOMPurify.sanitize(marked.parse(userInput));

    return (
      <foreignObject
        data-element-id={elementId}
        x={startingPoint[0]}
        y={startingPoint[1]}
        width={width}
        height={height}
      >
        {(render)
          ? <div className='marked-output' dangerouslySetInnerHTML={{ __html: userInputHTMLClean }}></div>
          : <textarea
              placeholder='Type Markdown here. Hit Esc to cancel, Ctrl-Enter to save.'
              cols={40}
              rows={10}
              autoFocus={true}
              value={userInput}
              onChange={handleChange}
            >
            </textarea> // update this textarea
        }
      </foreignObject>
    );
  }
}
