import React from 'react';

export default function ToolbarColorButton(props) {
  // props should supply the following
  // colorName: string describing color ('red')
  // chooseColor: a function to set the color of the Home state
  // colorValue: HEX or other color representation ('#FF6B6B')

  return (
      <p className="control" data-color={props.colorName} onClick={props.chooseColor}>
        <button className="button is-white">
          <span style={{ color: props.colorValue }} className="icon is-small">
            <i className="fas fa-circle"></i>
          </span>
        </button>
      </p>
  );
}
