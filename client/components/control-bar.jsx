import React from 'react';

export default class ControlBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleSaveClick(event) {
    event.preventDefault();
  }

  render() {
    return (
      <nav className='level is-mobile is-position-fixed top-5pct right-5pct'>
        <div className="level-right">
          <div className="level-item">
            <p className="control" onClick={this.handleSaveClick}>
              <button className="button is-white" disabled={this.context.userId === null}>
                <span className="icon is-small">
                  <i className="fa-regular fa-floppy-disk"></i>
                </span>
              </button>
            </p>
          </div>
        </div>
      </nav>
    );
  }
}
