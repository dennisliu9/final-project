import React from 'react';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(event) {
    const selectedTool = event.currentTarget.dataset.tool;
    this.props.updateCurrentTool(selectedTool);
  }

  render() {
    return (
      <div id='toolbar' className="field has-addons is-position-fixed bottom-10pct">
        <p className="control" data-tool="pen" onClick={this.handleButtonClick}>
          <button className="button is-selected is-primary">
            <span className="icon is-small">
              <i className="fas fa-pen"></i>
            </span>
          </button>
        </p>
        <p className="control" data-tool="eraser" onClick={this.handleButtonClick}>
          <button className="button">
            <span className="icon is-small">
              <i className="fas fa-eraser"></i>
            </span>
          </button>
        </p>
      </div>
    );
  }
}
