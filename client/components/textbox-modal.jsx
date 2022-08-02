import React from 'react';

export default class TextboxModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInput: '',
      invalidInput: false
    };
    this.handleTextInput = this.handleTextInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextInput(event) {
    this.setState({
      userInput: event.target.value,
      invalidInput: (event.target.value === '')
    });
  }

  handleSubmit(event) {
    if (this.state.userInput === '') {
      this.setState({ invalidInput: true });
    } else {
      this.props.handleTextboxModalSubmit(this.state.userInput, this.props.currentElementId);
      this.props.finishTextWriting(null);
    }
  }

  render() {
    return (
      <div className="modal is-hidden-desktop is-active">
        <div className="modal-background"></div>
        <div className="modal-card px-6">
          <header className="modal-card-head">
            <p className="modal-card-title">Insert Text</p>
            <button
              className="delete"
              aria-label='close'
              onClick={event => this.props.finishTextWriting(this.props.currentElementId)}
            >
            </button>
          </header>
          <section className="modal-card-body">
            <textarea
              className={`textarea ${(this.state.invalidInput) ? 'is-danger' : ''}`}
              placeholder='Type your plaintext here'
              onChange={this.handleTextInput}
              required
            >
            </textarea>
            <p className={`help is-danger ${(this.state.invalidInput) ? '' : 'is-invisible'}`}>Please enter some text</p>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-space-between">
            <button
              className="button is-danger is-outlined"
              onClick={event => this.props.finishTextWriting(this.props.currentElementId)}
            >
              Cancel
            </button>
            <button
              className="button is-primary"
              onClick={this.handleSubmit}
            >
              Submit
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
