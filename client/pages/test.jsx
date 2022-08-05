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
    // console.log('code:', code);
    // console.log('lang:', lang);
    return Prism.highlight(code, Prism.languages[lang], lang); // like Prism.highlight(sampleCode, Prism.languages.javascript, 'javascript')
  }
});

export default class Test extends React.Component {
  render() {
    const sampleCode = `// Here is my arbitary code
    const myVar = 'hello';
    function myFunc(param1, param2) {
      console.log('Yep, we are in here')
      this.state.property = writeDirectlyToState(veryCool)
    }`;

    //     const sampleCode = `
    // <h1>Howdy</h1>
    // <p class="is-italic">Partner</p>

    // <!-- Comment? -->
    // <ul>
    //     <li>1</li>
    //     <li>2</li>
    //     <li>3</li>
    // </ul>
    // `;

    const sampleMD = `
# Big Header here

That was a big header, this is text.
> Note: take more notes.

## Sample code block

\`\`\`javascript
${sampleCode}
\`\`\`
`;

    // console.log('sampleMD: ', sampleMD);

    const sampleHtml = DOMPurify.sanitize(marked.parse(sampleMD));

    // DOMPurify.sanitize('<img src=x onerror=alert(1)//>');
    // console.log('removed: ', DOMPurify.removed);
    // const highlighted = Prism.highlight(sampleCode, Prism.languages.javascript, 'javascript');

    return (
      <div className='marked-output' dangerouslySetInnerHTML={{ __html: sampleHtml }}>
      </div>
    );
  }
}
