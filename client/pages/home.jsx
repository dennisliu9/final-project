import React from 'react';
import SVGCanvas from '../components/svg-canvas';
import Toolbar from '../components/toolbar';
import ControlBar from '../components/control-bar';
import AppContext from '../lib/app-context';

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
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  static defaultProps = {
    drawingId: null,
    isDrawingSaved: null
  };

  componentDidMount() {
    // conditionally call createNewDrawing based on if drawingId starts off as null
    // what happens if there's an error?
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

  handleSaveClick() {
    const userId = this.context.userId;
    const drawingId = this.state.drawingId;
    let isDrawingSaved;

    const saveDrawing = () => {
      // Save drawing for user, then check save status to update state
      return fetch(`api/drawingsaves/save/${drawingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })
        .then(response => {
          return this.checkSaveStatus(drawingId);
        })
        .then(response => {
          isDrawingSaved = response.isSaved;
          return Promise.resolve();
        })
        .then(response => this.setState({
          isDrawingSaved
        }));
    };

    const unsaveDrawing = () => {
      // Do the same as saving but send a DELETE request to unsave route
      return fetch(`api/drawingsaves/unsave/${drawingId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      })
        .then(response => {
          return this.checkSaveStatus(drawingId);
        })
        .then(response => {
          isDrawingSaved = response.isSaved;
          return Promise.resolve();
        })
        .then(response => this.setState({
          isDrawingSaved
        }));
    };

    if (!this.state.isDrawingSaved) {
      this.context.toast.promise(
        saveDrawing,
        {
          pending: 'Saving drawing to your account...',
          // success: 'Drawing saved!',
          success: {
            render({ data }) {
              return `Hello ${data}`;
            }
          },
          error: 'There was a problem saving the drawing!'
        }
      )
        .catch(err => console.error('Fetch failed during handleSaveClick(): ', err));
    } else {
      this.context.toast.promise(
        unsaveDrawing,
        {
          pending: 'Un-saving the drawing...',
          success: 'Drawing was successfully un-saved!',
          error: 'There was a problem un-saving the drawing!'
        }
      )
        .catch(err => console.error('Fetch failed during handleSaveClick(): ', err));
    }
  }

  render() {
    return (
      <div className="page-center">
        <SVGCanvas
          currentTool={this.state.currentTool}
          currentColor={this.state.currentColor}
          elements={this.state.elements}
          drawingId={this.state.drawingId}
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
          handleSaveClick={this.handleSaveClick}
        />
      </div>
    );
  }
}

Home.contextType = AppContext;
