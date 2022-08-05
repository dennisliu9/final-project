import React from 'react';
import LogoSplash from './logo-splash';
import DrawnPath from './drawn-path';
import Textbox from './textbox';
import TextboxModal from './textbox-modal';
import MarkdownBox from './markdown-box';

const svgNS = 'http://www.w3.org/2000/svg';

export default class SVGCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextElementId: 1,
      currentElementId: null,
      isErasing: false,
      isTyping: false,
      strokeColor: this.props.currentColor.colorValue,
      strokeWidth: 5,
      fontSize: '2rem',
      markdownBoxDimensions: [parseInt(window.innerWidth / 2), parseInt(window.innerHeight / 3)], // width, height
      elements: [
        // Example drawnPath object
        // {
        //   elementType: 'path',
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
        // Example textbox object
        // {
        //   elementType: 'text',
        //   elementId: 1,
        //   startingPoint: [140, 140],
        //   userInput: 'hello world',
        //   fill: 'hsl(204, 86%, 53%)',
        //   fontSize: '2rem'
        // }
      ]
    };
    this.addCoordinateToPathData = this.addCoordinateToPathData.bind(this);
    this.addUserInputToTextData = this.addUserInputToTextData.bind(this);
    this.addUserInputToMarkdownData = this.addUserInputToMarkdownData.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.finishTextWriting = this.finishTextWriting.bind(this);
    this.finishMarkdownWriting = this.finishMarkdownWriting.bind(this);
    this.updateCursorType = this.updateCursorType.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleTextboxModalSubmit = this.handleTextboxModalSubmit.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentColor !== prevProps.currentColor) {
      this.setState({
        strokeColor: this.props.currentColor.colorValue
      });
    }
    if (this.props.currentTool !== prevProps.currentTool) {
      // bugfix for when a markdown input is open but not submitted and tool changes
      if (prevProps.currentTool === 'textMd') {
        const nonRenderedMarkdown = this.state.elements.map(elementDetail => {
          if (elementDetail.elementType !== 'textMd' || elementDetail.render === true) {
            return elementDetail;
          } else if (elementDetail.userInput !== '') {
            return ({
              ...elementDetail,
              render: true
            });
          } else {
            return null;
          }
        });

        const cleanedNonRenderedMarkdown = nonRenderedMarkdown.filter(element => element !== null);

        this.setState({
          elements: cleanedNonRenderedMarkdown
        });
      }

      if (prevProps.currentTool === 'text' && this.state.currentElementId !== null) {
        this.finishTextWriting();
      }
      this.setState({
        currentElementId: null,
        isErasing: false,
        isTyping: false
      });
    }
  }

  addCoordinateToPathData(coordinateArr, elementsIdx) {
    // Retrieve object that we want to add the coordinate to
    const modifyPathObj = this.state.elements[elementsIdx];

    // Make a shallow copy of the coordinates it currently has
    const newPathData = [...modifyPathObj.pathData];
    newPathData.push(coordinateArr);

    // Recreate the object, substituting the new path data
    const newCurrentPath = {
      ...modifyPathObj,
      pathData: newPathData
    };

    // Put the new object back in the original location
    this.setState({
      elements: [...this.state.elements.slice(0, elementsIdx), newCurrentPath, ...this.state.elements.slice(elementsIdx + 1)]
    });
  }

  addUserInputToTextData(userInputKey, elementsIdx) {
    // Check for valid characters BEFORE calling this method
    const modifyTextObj = this.state.elements[elementsIdx];
    let newTextData = modifyTextObj.userInput;
    if (userInputKey === 'Backspace') {
      newTextData = newTextData.slice(0, -1);
    } else {
      newTextData = newTextData + userInputKey;
    }

    const newCurrentText = {
      ...modifyTextObj,
      userInput: newTextData
    };

    this.setState({
      elements: [...this.state.elements.slice(0, elementsIdx), newCurrentText, ...this.state.elements.slice(elementsIdx + 1)]
    });
  }

  addUserInputToMarkdownData(event) {
    // use with onChange on textarea
    const modifyMarkdownObjIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);
    const modifyMarkdownObj = this.state.elements[modifyMarkdownObjIdx];

    const newMarkdownObj = {
      ...modifyMarkdownObj,
      userInput: event.target.value
    };

    this.setState({
      elements: [...this.state.elements.slice(0, modifyMarkdownObjIdx), newMarkdownObj, ...this.state.elements.slice(modifyMarkdownObjIdx + 1)]
    });
  }

  removeElement(elementId) {
    this.setState({
      elements: this.state.elements.filter(elementDetail => elementDetail.elementId !== Number(elementId))
    });
  }

  finishTextWriting(skipBlankCheck) {
    if (!skipBlankCheck) {
      // Check if userInput was blank and remove textbox if so
      if (this.state.elements.find(element => element.elementId === this.state.currentElementId).userInput === '') {
        this.removeElement(this.state.currentElementId);
      }
    }
    this.setState({
      currentElementId: null,
      isTyping: false
    });
  }

  finishMarkdownWriting(isCancel) {
    const modifyMarkdownObjIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);
    const modifyMarkdownObj = this.state.elements[modifyMarkdownObjIdx];

    if (modifyMarkdownObj.userInput === '' || isCancel) {
      // Remove element if input was blank
      this.removeElement(this.state.currentElementId);
      this.setState({ currentElementId: null });
    } else {
      // If input was not blank,
      // set render to true to turn user input into rendered Markdown
      // and "reinsert" new object into elements
      const newMarkdownObj = {
        ...modifyMarkdownObj,
        render: true
      };
      this.setState({
        currentElementId: null,
        elements: [...this.state.elements.slice(0, modifyMarkdownObjIdx), newMarkdownObj, ...this.state.elements.slice(modifyMarkdownObjIdx + 1)]
      });
    }
  }

  updateCursorType(currentTool) {
    // expecting this.props.currentTool
    switch (currentTool) {
      case 'pen':
      case 'eraser':
        return 'url("./images/circle-cursor.png") 64 64, default';
      case 'text':
      case 'textMd':
        return 'text';
    }
  }

  handleMouseDown(event) {
    if (this.props.currentTool === 'pen') {
      // Get location where user clicked
      const mouseLocation = [event.clientX, event.clientY];

      // Create a new drawnPath object with user click as startingPoint
      const newDrawnPath = {
        elementType: 'path',
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
        elements: [...this.state.elements, newDrawnPath]
      });
    } else if (this.props.currentTool === 'eraser') {
      this.setState({ isErasing: true });
    } else if (this.props.currentTool === 'text') {
      // If user has an active textbox but then clicks, exit
      if (this.state.isTyping) {
        this.finishTextWriting();
      } else {
        const mouseLocation = [event.clientX, event.clientY];
        const newTextbox = {
          elementType: 'text',
          elementId: this.state.nextElementId,
          startingPoint: mouseLocation,
          userInput: '',
          fill: this.state.strokeColor,
          fontSize: this.state.fontSize
        };
        this.setState({
          nextElementId: this.state.nextElementId + 1,
          currentElementId: this.state.nextElementId,
          elements: [...this.state.elements, newTextbox],
          isTyping: true
        });
      }
    } else if (this.props.currentTool === 'textMd') {
      if (event.target.tagName !== 'TEXTAREA') {
        // If user did not click on a foreignObject
        if (!document.elementsFromPoint(event.clientX, event.clientY).some(element => element.tagName === 'foreignObject')) {
          if (this.state.currentElementId && this.state.elements.find(element => element.elementId === this.state.currentElementId).render === false) {
            this.finishMarkdownWriting();
          } else {
            const mouseLocation = [event.clientX, event.clientY];
            const newMarkdownBox = {
              elementType: 'textMd',
              elementId: this.state.nextElementId,
              startingPoint: mouseLocation,
              width: this.state.markdownBoxDimensions[0],
              height: this.state.markdownBoxDimensions[1],
              userInput: '',
              render: false
            };
            this.setState({
              nextElementId: this.state.nextElementId + 1,
              currentElementId: this.state.nextElementId,
              elements: [...this.state.elements, newMarkdownBox]
            });
          }
        }
      }
    }
  }

  handleTouchStart(event) {
    if (this.props.currentTool === 'pen') {
      // Get location where user touched using touches
      const mouseLocation = [event.touches[0].clientX, event.touches[0].clientY];

      const newDrawnPath = {
        elementType: 'path',
        elementId: this.state.nextElementId,
        startingPoint: mouseLocation,
        pathData: [],
        stroke: this.state.strokeColor,
        strokeWidth: this.state.strokeWidth
      };

      this.setState({
        nextElementId: this.state.nextElementId + 1,
        currentElementId: this.state.nextElementId,
        elements: [...this.state.elements, newDrawnPath]
      });
    } else if (this.props.currentTool === 'eraser') {
      this.setState({ isErasing: true });
    } else if (this.props.currentTool === 'text') {
      const mouseLocation = [event.touches[0].clientX, event.touches[0].clientY];
      const newTextbox = {
        elementType: 'text',
        elementId: this.state.nextElementId,
        startingPoint: mouseLocation,
        userInput: '',
        fill: this.state.strokeColor,
        fontSize: this.state.fontSize
      };
      this.setState({
        nextElementId: this.state.nextElementId + 1,
        currentElementId: this.state.nextElementId,
        elements: [...this.state.elements, newTextbox],
        isTyping: true
      });
    } else if (this.props.currentTool === 'textMd') {
      if (event.target.tagName !== 'TEXTAREA' && event.target.tagName !== 'BUTTON') {
        // If user did not click on a foreignObject
        if (!document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY).some(element => element.tagName === 'foreignObject')) {
          if (this.state.currentElementId && this.state.elements.find(element => element.elementId === this.state.currentElementId).render === false) {
            // TODO: This will need to be reconsidered for how touch will work
            this.finishMarkdownWriting();
          } else {
            const mouseLocation = [event.touches[0].clientX, event.touches[0].clientY];
            const newMarkdownBox = {
              elementType: 'textMd',
              elementId: this.state.nextElementId,
              startingPoint: mouseLocation,
              height: this.state.markdownBoxDimensions[1],
              width: this.state.markdownBoxDimensions[0],
              userInput: '',
              render: false
            };
            this.setState({
              nextElementId: this.state.nextElementId + 1,
              currentElementId: this.state.nextElementId,
              elements: [...this.state.elements, newMarkdownBox]
            });
          }
        }
      }
    }
  }

  handleMouseMove(event) {
    if (this.props.currentTool === 'pen') {
      // When using pen, highlighting of text (especially of text in MD boxes) should be disabled
      event.preventDefault();
      if (this.state.currentElementId !== null) {
        const mouseLocation = [event.clientX, event.clientY];
        const currentPathIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);

        this.addCoordinateToPathData(mouseLocation, currentPathIdx);
      }
    } else if (this.state.isErasing === true && this.props.currentTool === 'eraser') {
      const elementsBelow = document.elementsFromPoint(event.clientX, event.clientY);
      if (elementsBelow[0].tagName === 'path' || elementsBelow[0].tagName === 'text') {
        this.removeElement(elementsBelow[0].dataset.elementId);
      } else if (elementsBelow.some(element => element.tagName === 'foreignObject')) {
        this.removeElement(elementsBelow.find(element => element.tagName === 'foreignObject').dataset.elementId);
      }
    }
  }

  handleTouchMove(event) {
    if (this.props.currentTool === 'pen') {
      if (this.state.currentElementId !== null) {
        const mouseLocation = [event.touches[0].clientX, event.touches[0].clientY];
        const currentPathIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);

        this.addCoordinateToPathData(mouseLocation, currentPathIdx);
      }
    } else if (this.state.isErasing === true && this.props.currentTool === 'eraser') {
      const elementsBelow = document.elementsFromPoint(event.touches[0].clientX, event.touches[0].clientY);
      if (elementsBelow[0].tagName === 'path' || elementsBelow[0].tagName === 'text') {
        this.removeElement(elementsBelow[0].dataset.elementId);
      } else if (elementsBelow.some(element => element.tagName === 'foreignObject')) {
        this.removeElement(elementsBelow.find(element => element.tagName === 'foreignObject').dataset.elementId);
      }
    }
  }

  handleMouseUp(event) {
    if (this.props.currentTool === 'pen') {
      const currentPathIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);
      if (this.state.elements[currentPathIdx].pathData.length === 0) {
        // If mouse was clicked but no mouse movement was done, draw a dot.
        const mouseLocation = this.state.elements[currentPathIdx].startingPoint;
        this.addCoordinateToPathData(mouseLocation, currentPathIdx);
      }
      this.setState({
        currentElementId: null
      });
    } else if (this.props.currentTool === 'eraser') {
      this.setState({ isErasing: false });
    }
  }

  handleTouchEnd(event) {
    event.preventDefault(); // prevents mouse events from firing

    if (this.props.currentTool === 'pen') {
      const currentPathIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);
      if (this.state.elements[currentPathIdx].pathData.length === 0) {
        const mouseLocation = this.state.elements[currentPathIdx].startingPoint;
        this.addCoordinateToPathData(mouseLocation, currentPathIdx);
      }
      this.setState({
        currentElementId: null
      });
    } else if (this.props.currentTool === 'eraser') {
      this.setState({ isErasing: false });
    }
  }

  handleKeydown(event) {
    // Note: copy-paste not supported
    if (this.state.isTyping === true) {
      const currentTextboxIdx = this.state.elements.findIndex(element => element.elementId === this.state.currentElementId);
      if (event.key.length === 1 || event.key === 'Backspace') {
        this.addUserInputToTextData(event.key, currentTextboxIdx);
      } else if (event.key === 'Escape' || event.key === 'Enter') {
        this.finishTextWriting();
      }
    } else if (this.state.currentElementId !== null && this.props.currentTool === 'textMd') {
      // condition could be improved to target "actively typing for a markdown box"
      if (event.key === 'Escape') {
        // Escape should remove even if there was text
        this.removeElement(this.state.currentElementId);
        this.setState({ currentElementId: null });
      } else if (event.key === 'Enter' && event.ctrlKey) {
        this.finishMarkdownWriting();
      }

    }
  }

  handleTextboxModalSubmit(userInputText, currentElementId) {
    // modal submission doesn't submit one key at a time but instead entire input at once
    const modifyTextObjIdx = this.state.elements.findIndex(element => element.elementId === currentElementId);
    const modifyTextObj = this.state.elements[modifyTextObjIdx];
    const newTextData = userInputText;

    const newCurrentText = {
      ...modifyTextObj,
      userInput: newTextData
    };

    this.setState({
      elements: [...this.state.elements.slice(0, modifyTextObjIdx), newCurrentText, ...this.state.elements.slice(modifyTextObjIdx + 1)]
    });
  }

  render() {
    return (
      <div className="page-center">
        <svg
          id="svg-canvas"
          className="page-center"
          xmlns={svgNS}
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
          onKeyDown={this.handleKeydown}
          tabIndex="0" // allows svg to get keyboard inputs
          style={{ '--cursor-type': this.updateCursorType(this.props.currentTool) }}
        >
          { this.state.elements.map(
            elementDetail => {
              if (elementDetail.elementType === 'path') {
                return (
                  <DrawnPath
                    key={elementDetail.elementId}
                    elementId={elementDetail.elementId}
                    startingPoint={elementDetail.startingPoint}
                    pathData={elementDetail.pathData}
                    stroke={elementDetail.stroke}
                    strokeWidth={elementDetail.strokeWidth}
                  />
                );
              } else if (elementDetail.elementType === 'text') {
                return (
                  <Textbox
                    key={elementDetail.elementId}
                    elementId={elementDetail.elementId}
                    startingPoint={elementDetail.startingPoint}
                    userInput={elementDetail.userInput}
                    fill={elementDetail.fill}
                    fontSize={elementDetail.fontSize}
                    isCurrentTextbox={elementDetail.elementId === this.state.currentElementId}
                  />
                );
              } else if (elementDetail.elementType === 'textMd') {
                return (
                  <MarkdownBox
                    key={elementDetail.elementId}
                    elementId={elementDetail.elementId}
                    startingPoint={elementDetail.startingPoint}
                    width={elementDetail.width}
                    height={elementDetail.height}
                    userInput={elementDetail.userInput}
                    render={elementDetail.render}
                    handleChange={this.addUserInputToMarkdownData}
                    finishMarkdownWriting={this.finishMarkdownWriting}
                  />
                );
              } else { return <></>; }
            }
          )}
        </svg>
        {(this.state.elements.length > 0) ? <></> : <LogoSplash />}
        {(this.state.isTyping)
          ? (
            <TextboxModal
              finishTextWriting={this.finishTextWriting}
              currentElementId={this.state.currentElementId}
              handleTextboxModalSubmit={this.handleTextboxModalSubmit}
            />
            )
          : <></>
        }
      </div>
    );
  }
}
