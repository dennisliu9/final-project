import React from 'react';

export default class Toolbar extends React.Component {
  render() {
    return (
      // <div className="field has-addons"></div>
      <div className="field has-addons">
        <p className="control">
          <button className="button is-selected is-primary">
            <span className="icon is-small">
              <i className="fas fa-pen"></i>
            </span>
          </button>
        </p>
        <p className="control">
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
