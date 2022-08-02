import React from 'react';

export default class TextboxModal extends React.Component {
  render() {
    return (
      <div className="modal is-hidden-desktop is-active">
        <div className="modal-background"></div>
        <div className="modal-card px-6">
          <header className="modal-card-head">
            <p className="modal-card-title">Insert Text</p>
            <button className="delete" aria-label='close'></button>
          </header>
          <section className="modal-card-body">
            <textarea className='textarea' placeholder='Type your plaintext here'></textarea>
          </section>
          <footer className="modal-card-foot is-flex is-justify-content-space-between">
            <button className="button is-danger is-outlined">Cancel</button>
            <button className="button is-primary">Submit</button>
          </footer>
        </div>
      </div>
    );
  }
}
