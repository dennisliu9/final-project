import React from 'react';
import LogoSplash from './logo-splash';
import DrawnPath from './drawn-path';
import Textbox from './textbox';

const svgNS = 'http://www.w3.org/2000/svg';

export default class SVGCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextElementId: 1,
      currentElementId: null,
      isErasing: false,
      isTyping: false,
      strokeColor: this.props.currentColor.colorValue,
      strokeWidth: 5,
      elements: [
        // Example drawnPath object
        // {
        //   elementType: 'path',
        //   elementId: 0,
        //   startingPoint: [10, 10],
        //   pathData: [
        //     [150, 150],
        //     [250, 300],
        //     [350, 450],
        //     [520, 229]
        //   ],
        //   stroke: 'hsl(204, 86%, 53%)',
        //   strokeWidth: 5
        // }
      ]
    };
    this.addCoordinateToPathData = this.addCoordinateToPathData.bind(this);
    this.removePath = this.removePath.bind(this);
    this.updateCursorType = this.updateCursorType.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentColor !== prevProps.currentColor) {
      this.setState({
        strokeColor: this.props.currentColor.colorValue
      });
    }
  }

  addCoordinateToPathData(coordinateArr, elementsIdx) {
    // Retrieve object that we want to add the coordinate to
    const modifyPathObj = this.state.elements[elementsIdx];

    // Make a shallow copy of the coordinates it currently has
    const newPathData = [...modifyPathObj.pathData];
    newPathData.push(coordinateArr);

    // Recreate the object, substituting the new path data
    const newCurrentPath = {
      elementType: modifyPathObj.elementType,
      elementId: modifyPathObj.elementId,
      startingPoint: modifyPathObj.startingPoint,
      pathData: newPathData,
      stroke: modifyPathObj.stroke,
      strokeWidth: modifyPathObj.strokeWidth
    };

    // Put the new object back in the original location
    this.setState({
      elements: [...this.state.elements.slice(0, elementsIdx), newCurrentPath, ...this.state.elements.slice(elementsIdx + 1)]
    });
  }

  removePath(elementId) {
    this.setState({
      elements: this.state.elements.filter(elementDetail => elementDetail.elementId !== Number(elementId))
    });
  }

  updateCursorType(currentTool) {
    // expecting this.props.currentTool
    if (currentTool === 'pen' || currentTool === 'eraser') {
      return 'url("./images/circle-cursor.png") 64 64, default';
    } else if (currentTool === 'text') {
      return 'text';
    }
  }

  handleMouseDown(event) {
    if (this.props.currentTool === 'pen') {
      // Get location where user clicked
      const mouseLocation = [event.clientX, event.clientY];

      // Create a new drawnPath object with user click as startingPoint
      const newDrawnPath = {
        elementType: 'path',
        elementId: this.state.nextElementId,
        startingPoint: mouseLocation,
        pathData: [],
        stroke: this.state.strokeColor,
        strokeWidth: this.state.strokeWidth
      };

      // Add new path to array of paths, and update element ID's
      this.setState({
        nextElementId: this.state.nextElementId + 1,
        currentElementId: this.state.nextElementId,
        elements: [...this.state.elements, newDrawnPath]
      });
    } else if (this.props.currentTool === 'eraser') {
      this.setState({ isErasing: true });
    }
  }

  handleTouchStart(event) {
    if (this.props.currentTool === 'pen') {
      // Get location where user touched using touches
      const mouseLocation = [event.touches[0].clientX, event.touches[0].clientY];

      const newDrawnPath = {
        elementType: 'path',
        elementId: this.state.nextElementId,
        startingPoint: mouseLocation,
        pathData: [],
        stroke: this.state.strokeColor,
        strokeWidth: this.state.strokeWidth
      };

      this.setState({
        nextElementId: this.state.nextElementId + 1,
        currentElementId: this.state.nextElementId,
        elements: [...this.state.elements, newDrawnPath]
      });
    } else if (this.props.currentTool === 'eraser') {
      this.setState({ isErasing: true });
    }
  }

  handleMouseMove(event) {
    if (this.props.currentTool === 'pen') {
      if (this.state.currentElementId !== null) {
        const mouseLocation = [event.clientX, event.clientY];
        const currentPathIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);

        this.addCoordinateToPathData(mouseLocation, currentPathIdx);
      }
    } else if (this.state.isErasing === true && this.props.currentTool === 'eraser') {
      const elementBelow = document.elementFromPoint(event.clientX, event.clientY);
      if (elementBelow.tagName === 'path') {
        this.removePath(elementBelow.dataset.elementId);
      }
    }
  }

  handleTouchMove(event) {
    if (this.props.currentTool === 'pen') {
      if (this.state.currentElementId !== null) {
        const mouseLocation = [event.touches[0].clientX, event.touches[0].clientY];
        const currentPathIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);

        this.addCoordinateToPathData(mouseLocation, currentPathIdx);
      }
    } else if (this.state.isErasing === true && this.props.currentTool === 'eraser') {
      const elementBelow = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY);
      if (elementBelow.tagName === 'path') {
        this.removePath(elementBelow.dataset.elementId);
      }
    }
  }

  handleMouseUp(event) {
    if (this.props.currentTool === 'pen') {
      const currentPathIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);
      if (this.state.elements[currentPathIdx].pathData.length === 0) {
        // If mouse was clicked but no mouse movement was done, draw a dot.
        const mouseLocation = this.state.elements[currentPathIdx].startingPoint;
        this.addCoordinateToPathData(mouseLocation, currentPathIdx);
      }
      this.setState({
        currentElementId: null
      });
    } else if (this.props.currentTool === 'eraser') {
      this.setState({ isErasing: false });
    }
  }

  handleTouchEnd(event) {
    event.preventDefault(); // prevents mouse events from firing

    if (this.props.currentTool === 'pen') {
      const currentPathIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);
      if (this.state.elements[currentPathIdx].pathData.length === 0) {
        const mouseLocation = this.state.elements[currentPathIdx].startingPoint;
        this.addCoordinateToPathData(mouseLocation, currentPathIdx);
      }
      this.setState({
        currentElementId: null
      });
    } else if (this.props.currentTool === 'eraser') {
      this.setState({ isErasing: false });
    }
  }

  render() {
    return (
      <div className="page-center">
        <svg
          id="svg-canvas"
          className="page-center"
          xmlns={svgNS}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          style={{ '--cursor-type': this.updateCursorType(this.props.currentTool) }}
        >
          { this.state.elements.map(
            elementDetail => {
              // Successfully changed drawnPaths to elements
              if (elementDetail.elementType === 'path') {
                return (
                  <DrawnPath
                    key={elementDetail.elementId}
                    elementId={elementDetail.elementId}
                    startingPoint={elementDetail.startingPoint}
                    pathData={elementDetail.pathData}
                    stroke={elementDetail.stroke}
                    strokeWidth={elementDetail.strokeWidth}
                  />
                );
              } else if (elementDetail.elementType === 'text') {
                return (
                  <Textbox
                    key={elementDetail.elementId}
                    elementId={elementDetail.elementId}
                    startingPoint={elementDetail.startingPoint}
                    userInput={elementDetail.userInput}
                    fill={elementDetail.fill}
                    fontSize={elementDetail.fontSize}
                  />
                );
              } else { return <></>; }
            }
          )}
        </svg>
        {(this.state.elements.length > 0) ? <></> : <LogoSplash />}
      </div>
    );
  }
}
