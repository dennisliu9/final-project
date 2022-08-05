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
  },
  headerIds: false
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
  // handleChange = {this.addUserInputToMarkdownData}
  // finishMarkdownWriting = {this.finishMarkdownWriting}

  render() {

    const { elementId, startingPoint, width, height, userInput, render, handleChange, finishMarkdownWriting } = this.props;
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
          : <>
            <textarea
              className='textarea'
              placeholder='Type Markdown here. Hit Esc to cancel, Ctrl-Enter to save (or just click outside the box).'
              cols={40}
              rows={5}
              autoFocus={true}
              value={userInput}
              onChange={handleChange}
            >
            </textarea>
            <nav className="level is-hidden-desktop is-mobile mt-2">
              <div className="level-left">
                <div className="level-item">
                  <button className="button is-danger is-outlined" onTouchEnd={() => finishMarkdownWriting(true)}>
                    Cancel
                  </button>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <button className="button is-primary" onTouchEnd={() => finishMarkdownWriting()}>
                    Submit
                  </button>
                </div>
              </div>
            </nav>
          </>
        }
      </foreignObject>
    );
  }
}
