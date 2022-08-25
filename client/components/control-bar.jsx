import React from 'react';
import AppContext from '../lib/app-context';

export default class ControlBar extends React.Component {

  render() {
    return (
      <nav className='level is-mobile is-position-fixed top-5pct right-5pct'>
        <div className="level-right">
          <div className="level-item">
            <p className="control" onClick={this.props.handleSaveClick}>
              <button
                className={`button is-white ${(this.props.isDrawingSaved) ? 'is-primary is-inverted' : ''}`}
                disabled={this.context.userId === null}
              >
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

ControlBar.contextType = AppContext;
