import React from 'react';
import SVGCanvas from '../components/svg-canvas';
import Toolbar from '../components/toolbar';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTool: 'pen'
    };
    this.updateCurrentTool = this.updateCurrentTool.bind(this);
  }

  updateCurrentTool(toolname) {
    this.setState({ currentTool: toolname });
  }

  render() {
    return (
      <div className="page-center">
        <SVGCanvas currentTool={this.state.currentTool} />
        <Toolbar currentTool={this.state.currentTool} updateCurrentTool={this.updateCurrentTool} />
      </div>
    );
  }
}
