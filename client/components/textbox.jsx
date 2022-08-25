import React from 'react';

export default class Textbox extends React.Component {
  render() {
    return (
      <text
        data-element-id={this.props.elementId}
        x={this.props.startingPoint[0]}
        y={this.props.startingPoint[1]}
        style={{
          fill: this.props.fill,
          fontSize: this.props.fontSize,
          userSelect: 'none'
        }}
      >
        {this.props.userInput}
        {(this.props.isCurrentTextbox) ? <tspan className='text-cursor'>|</tspan> : <></>}
      </text>
    );
  }
}
