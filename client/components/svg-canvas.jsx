import React from 'react';
import LogoSplash from '../components/logo-splash';
import DrawnPath from './drawn-path';

const svgNS = 'http://www.w3.org/2000/svg';

export default class SVGCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextElementId: 1,
      currentElementId: null,
      strokeColor: 'hsl(204, 86%, 53%)',
      strokeWidth: 5,
      drawnPaths: [
        // Example drawnPath object
        // {
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
    this.handleMousedown = this.handleMousedown.bind(this);
    this.handleMousemove = this.handleMousemove.bind(this);
    this.handleMouseup = this.handleMouseup.bind(this);
  }

  addCoordinateToPathData(coordinateArr, drawnPathsIdx) {
    // Retrieve object that we want to add the coordinate to
    const modifyPathObj = this.state.drawnPaths[drawnPathsIdx];

    // Make a shallow copy of the coordinates it currently has
    const newPathData = [...modifyPathObj.pathData];
    newPathData.push(coordinateArr);

    // Recreate the object, substituting the new path data
    const newCurrentPath = {
      elementId: modifyPathObj.elementId,
      startingPoint: modifyPathObj.startingPoint,
      pathData: newPathData,
      stroke: modifyPathObj.stroke,
      strokeWidth: modifyPathObj.strokeWidth
    };

    // Put the new object back in the original location
    this.setState({
      drawnPaths: [...this.state.drawnPaths.slice(0, drawnPathsIdx), newCurrentPath, ...this.state.drawnPaths.slice(drawnPathsIdx + 1)]
    });
  }

  handleMousedown(event) {
    // Get location where user clicked
    const mouseLocation = [event.clientX, event.clientY];

    // Create a new drawnPath object with user click as startingPoint
    const newDrawnPath = {
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
      drawnPaths: [...this.state.drawnPaths, newDrawnPath]
    });
  }

  handleMousemove(event) {
    if (this.state.currentElementId !== null) {
      const mouseLocation = [event.clientX, event.clientY];
      const currentPathIdx = this.state.drawnPaths.findIndex(element => element.elementId === this.state.currentElementId);

      this.addCoordinateToPathData(mouseLocation, currentPathIdx);
    }

  }

  handleMouseup(event) {
    const currentPathIdx = this.state.drawnPaths.findIndex(element => element.elementId === this.state.currentElementId);
    if (this.state.drawnPaths[currentPathIdx].pathData.length === 0) {
      // If mouse was clicked but no mouse movement was done, draw a dot.
      const mouseLocation = [event.clientX, event.clientY];
      this.addCoordinateToPathData(mouseLocation, currentPathIdx);
    }
    this.setState({
      currentElementId: null
    });
  }

  render() {
    return (
      <div className="page-center">
        <svg
          id="svg-canvas"
          className="page-center"
          xmlns={svgNS}
          onMouseDown={this.handleMousedown}
          onMouseMove={this.handleMousemove}
          onMouseUp={this.handleMouseup}
        >
          { this.state.drawnPaths.map(
            pathDetail =>
              <DrawnPath
                key={pathDetail.elementId}
                startingPoint={pathDetail.startingPoint}
                pathData={pathDetail.pathData}
                stroke={pathDetail.stroke}
                strokeWidth={pathDetail.strokeWidth}
              />
          )}
        </svg>
        {(this.state.drawnPaths.length > 0) ? <></> : <LogoSplash />}
      </div>
    );
  }
}
