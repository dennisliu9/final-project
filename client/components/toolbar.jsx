import React from 'react';
import ToolbarColorButton from './toolbar-color-button';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectingColor: false,
      selectingTextType: false,
      textType: 'text',
      previousTool: null
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.toggleColorSelect = this.toggleColorSelect.bind(this);
    this.chooseColor = this.chooseColor.bind(this);
  }

  handleButtonClick(event) {
    const selectedTool = event.currentTarget.dataset.tool;
    this.props.updateCurrentTool(selectedTool);

    if (selectedTool === 'text' || selectedTool === 'textMd') {
      this.setState({
        selectingTextType: !this.state.selectingTextType,
        textType: selectedTool
      });
    } else if (this.state.selectingTextType) {
      this.setState({ selectingTextType: false });
    }
  }

  toggleColorSelect(event) {
    // deselect current tool during color selection, but save its value to revert when color is selected
    this.setState({
      selectingColor: !this.state.selectingColor,
      previousTool: (this.state.previousTool) ? null : this.props.currentTool
    });
    this.props.updateCurrentTool(this.state.previousTool);
  }

  chooseColor(event) {
    this.toggleColorSelect();
    this.props.updateCurrentColor(event.currentTarget.dataset.color);
  }

  render() {
    return (
      <nav id='toolbar' className="level is-mobile is-position-fixed bottom-10pct">
        <div className="level-left">
          {/* tools */}
          <div className="level-item">
            <div className="field has-addons">
              <p className="control" data-tool="pen" onClick={this.handleButtonClick}>
                <button className={`button ${(this.props.currentTool === 'pen') ? 'is-primary' : ''}`}>
                  <span className="icon is-small">
                    <i className="fas fa-pen"></i>
                  </span>
                </button>
              </p>
              {/* text */}
              <div className={`control dropdown is-right is-up ${(this.state.selectingTextType) ? 'is-active' : ''}`}>
                <div className="dropdown-trigger control" data-tool={this.state.textType} onClick={this.handleButtonClick}>
                  {/* may need to change condition below */}
                  <button className={`button ${(this.props.currentTool === this.state.textType) ? 'is-primary' : ''}`}>
                    <span className="icon is-small">
                      <i className={(this.state.textType === 'text') ? 'fas fa-t' : 'fa-brands fa-markdown'}></i>
                    </span>
                  </button>
                </div>
                {/* text types */}
                <div style={{ minWidth: 'max-content', left: '-30px' }} className="dropdown-menu" id="color-select-menu" role="menu">
                  <div className="dropdown-content">
                    <div className="dropdown-item">
                      <div className="level">
                        <div className="field has-addons">
                          <p className="control" data-tool="text" onClick={this.handleButtonClick}>
                            <button className='button is-white'>
                              <span className="icon is-small">
                                <i className="fas fa-t"></i>
                              </span>
                            </button>
                          </p>
                          <p className="control" data-tool="textMd" onClick={this.handleButtonClick}>
                            <button className='button is-white'>
                              <span className="icon is-small">
                                <i className="fa-brands fa-markdown"></i>
                              </span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            <div className={`dropdown is-right is-up ${(this.state.selectingColor) ? 'is-active' : ''}`}>
              <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="color-select-menu" onClick={this.toggleColorSelect}>
                  <span style={{ color: this.props.currentColor.colorValue }} className="icon is-small">
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
                      {this.props.colors.map(colorObj => {
                        return <ToolbarColorButton
                          key={colorObj.colorName}
                          colorName={colorObj.colorName}
                          colorValue={colorObj.colorValue}
                          chooseColor={this.chooseColor}
                        />;
                      })}
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
