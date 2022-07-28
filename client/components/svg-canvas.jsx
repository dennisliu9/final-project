import React from 'react';
import LogoSplash from '../components/logo-splash';
import DrawnPath from './drawn-path';

const AppContext = React.createContext();
const svgNS = 'http://www.w3.org/2000/svg';

// For drawing paths, the canvas records the mouse locations and saves it to a state
// DrawnPaths are rendered by a .map() across all of the recorded path details in the state
// To update the array in the state, use setState with [...currentArray, newArray]

export default class SVGCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextElementId: 0,
      drawnPaths: [
        {
          elementId: 1,
          startingPoint: [10, 10],
          pathData: [
            [150, 150],
            [250, 300],
            [350, 450],
            [520, 229]
          ],
          stroke: 'hsl(204, 86%, 53%)',
          strokeWidth: 5
        }
      ]
    };
  }

  render() {
    const contextValue = { svgNS };

    return (
      <AppContext.Provider value={contextValue}>
        <div className="page-center">
          <svg id="svg-canvas" className="page-center" xmlns={contextValue.svgNS}>
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
      </AppContext.Provider>
    );
  }
}
