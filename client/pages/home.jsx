import React from 'react';
import SVGCanvas from '../components/svg-canvas';
import Toolbar from '../components/toolbar';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTool: 'pen',
      isLoading: true,
      drawingId: null,
      currentColor: {
        colorName: 'red',
        colorValue: '#FF6B6B'
      },
      colors: [
        {
          colorName: 'red',
          colorValue: '#FF6B6B'
        },
        {
          colorName: 'yellow',
          colorValue: '#FFD93D'
        },
        {
          colorName: 'green',
          colorValue: '#6BCB77'
        },
        {
          colorName: 'blue',
          colorValue: '#4D96FF'
        },
        {
          colorName: 'black',
          colorValue: '#292929'
        }
      ]
    };
    this.updateCurrentTool = this.updateCurrentTool.bind(this);
    this.updateCurrentColor = this.updateCurrentColor.bind(this);
  }

  updateCurrentTool(toolName) {
    this.setState({ currentTool: toolName });
  }

  updateCurrentColor(colorName) {
    // find color by colorName
    const selectedColor = this.state.colors.filter(colorObj => colorObj.colorName === colorName)[0];
    this.setState({ currentColor: selectedColor });
  }

  render() {
    return (
      <div className="page-center">
        <SVGCanvas currentTool={this.state.currentTool} currentColor={this.state.currentColor}/>
        <Toolbar
          currentTool={this.state.currentTool}
          updateCurrentTool={this.updateCurrentTool}
          currentColor={this.state.currentColor}
          updateCurrentColor={this.updateCurrentColor}
          colors={this.state.colors}
        />
      </div>
    );
  }
}
