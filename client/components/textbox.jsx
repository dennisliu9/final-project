import React from 'react';

export default class Textbox extends React.Component {
  // consider changing this to just a functional component
  render() {
    return (
      <text
        x={this.props.startingPoint[0]}
        y={this.props.startingPoint[1]}
        style={{
          fill: this.props.fill,
          fontSize: this.props.fontSize,
          userSelect: 'none'
        }}
      >
        {this.props.userInput}
      </text>
    );
  }
}

// elementId: 0,
//   startingPoint: [100, 100],
//     userInput: 'Hello, this is a\nmultiline text input.',
//       color: 'hsl(286, 98%, 50%)',
//         fontSize: '2rem'
