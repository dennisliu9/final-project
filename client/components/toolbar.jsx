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
      <nav id='toolbar' className="level  is-position-fixed bottom-10pct">
        <div className="level-left">
          {/* wrap each element below in a level-item? */}
          <div className="level-item">
            <div className="field has-addons">
              <p className="control" data-tool="pen" onClick={this.handleButtonClick}>
                <button className={`button ${(this.props.currentTool === 'pen') ? 'is-primary' : ''}`}>
                  <span className="icon is-small">
                    <i className="fas fa-pen"></i>
                  </span>
                </button>
              </p>
              <p className="control" data-tool="eraser" onClick={this.handleButtonClick}>
                <button className={`button ${(this.props.currentTool === 'eraser') ? 'is-primary' : ''}`}>
                  <span className="icon is-small">
                    <i className="fas fa-eraser"></i>
                  </span>
                </button>
              </p>
            </div>
          </div>
          {/* color selection */}
          <div className="level-item">
            <div className="dropdown is-up is-active">
              <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="color-select-menu">
                  <span className="icon is-small">
                    <i className="fas fa-circle" aria-hidden="true"></i>
                  </span>
                  <span className="icon is-small">
                    <i className="fas fa-angle-up" aria-hidden="true"></i>
                  </span>
                </button>
              </div>
              <div className="dropdown-menu" id="color-select-menu" role="menu">
                <div className="dropdown-content">
                  <div className="dropdown-item">
                    {/* colors */}
                    <div className="field has-addons">
                      <p className="control" data-color="red" onClick={() => console.log('1')}>
                        <button className="button is-white">
                          <span style={{ color: '#FF6B6B' }} className="icon is-small">
                            <i className="fas fa-circle"></i>
                          </span>
                        </button>
                      </p>
                      <p className="control" data-color="yellow" onClick={() => console.log('1')}>
                        <button className="button is-white">
                          <span style={{ color: '#FFD93D' }} className="icon is-small">
                            <i className="fas fa-circle"></i>
                          </span>
                        </button>
                      </p>
                      <p className="control" data-color="green" onClick={() => console.log('1')}>
                        <button className="button is-white">
                          <span style={{ color: '#6BCB77' }} className="icon is-small">
                            <i className="fas fa-circle"></i>
                          </span>
                        </button>
                      </p>
                      <p className="control" data-color="blue" onClick={() => console.log('1')}>
                        <button className="button is-white">
                          <span style={{ color: '#4D96FF' }} className="icon is-small">
                            <i className="fas fa-circle"></i>
                          </span>
                        </button>
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
