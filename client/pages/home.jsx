import React from 'react';
import SVGCanvas from '../components/svg-canvas';
import Toolbar from '../components/toolbar';
import ControlBar from '../components/control-bar';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTool: 'pen',
      isLoading: true,
      drawingId: null,
      elements: [],
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
    this.createNewDrawing = this.createNewDrawing.bind(this);
    this.retrieveDrawing = this.retrieveDrawing.bind(this);
    this.updateIsLoading = this.updateIsLoading.bind(this);
    this.updateCurrentTool = this.updateCurrentTool.bind(this);
    this.updateCurrentColor = this.updateCurrentColor.bind(this);
  }

  componentDidMount() {
    if (this.state.drawingId === null) {
      this.createNewDrawing();
    } else {
      this.retrieveDrawing();
    }
    this.updateIsLoading();

    // what happens if there's an error?
  }

  createNewDrawing() {
    const userId = this.context.userId;
    fetch('/api/drawings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })
      .then(response => response.json())
      .then(newDrawing => this.setState({
        drawingId: newDrawing.drawingId
      }))
      .catch(err => console.error('Fetch failed during createNewDrawing(): ', err));
  }

  retrieveDrawing() {
    const drawingId = this.state.drawingId;
    fetch(`api/drawings/${drawingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(results => this.setState({
        elements: results.elements
      }))
      .catch(err => console.error('Fetch failed during retrieveDrawing(): ', err));
  }

  updateIsLoading() {
    this.setState({
      isLoading: !this.state.isLoading
    });
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
        <ControlBar
          userId={this.context.userId}
        />
        <SVGCanvas
          currentTool={this.state.currentTool}
          currentColor={this.state.currentColor}
          elements={this.state.elements}
        />
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
