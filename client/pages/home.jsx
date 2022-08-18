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
      isDrawingSaved: false,
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
    this.checkSaveStatus = this.checkSaveStatus.bind(this);
    this.updateIsLoading = this.updateIsLoading.bind(this);
    this.updateCurrentTool = this.updateCurrentTool.bind(this);
    this.updateCurrentColor = this.updateCurrentColor.bind(this);
  }

  static defaultProps = {
    drawingId: null,
    isDrawingSaved: null
  };

  componentDidMount() {
  // TODO: Add check for if the drawing is saved for the current user
  // what happens if there's an error?

    // let (drawingId, elements, isSaved, etc.)
    // Then update the values in the chain
    let drawingId;
    let elements;
    let isDrawingSaved;
    this.createNewDrawing()
      .then(this.retrieveDrawing)
      .then(response => {
        drawingId = response.drawingId;
        elements = response.elements;
        // check Save status
        return this.checkSaveStatus(drawingId);
      })
      .then(response => {
        isDrawingSaved = response.isSaved;
        return Promise.resolve();
      })
      .then(response => this.setState({
        drawingId,
        elements,
        isDrawingSaved
      }))
      .then(this.updateIsLoading);

  }

  createNewDrawing() {
    const userId = this.context.userId;
    return fetch('/api/drawings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })
      .then(response => response.json())
      .catch(err => console.error('Fetch failed during createNewDrawing(): ', err));
  }

  retrieveDrawing(sqlResults) {
    const drawingId = sqlResults.drawingId;
    return fetch(`api/drawings/${drawingId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .catch(err => console.error('Fetch failed during retrieveDrawing(): ', err));
  }

  checkSaveStatus(drawingId) {
    // response should be { isSaved: true/false }
    const userId = this.context.userId;
    return fetch('/api/drawingsaves/issaved', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, drawingId })
    })
      .then(response => response.json())
      .catch(err => console.error('Fetch failed during checkSaveStatus(): ', err));
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
        <ControlBar
          userId={this.context.userId}
          drawingId={this.state.drawingId}
          isDrawingSaved={this.state.isDrawingSaved}
        />
      </div>
    );
  }
}
