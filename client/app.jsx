import React from 'react';
import Home from './pages/home';
import AppContext from './lib/app-context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Passing an object literal into value of AppContext.Provider causes
      // all Consumers to re-render when App re-renders because a new
      // object literal is created on App's re-render, meaning there is a new
      // value in value. By passing in a pre-created object in state, it does
      // not re-render the Consumers. See Caveats under Context in React docs
      // for more.
      contextValue: {
        userId: 1,
        toast
      }
    };
  }

  render() {
    window.addEventListener('offline', () => toast.error("You're offline, please try reconnecting and reloading!", { autoClose: false }));

    return (
      <AppContext.Provider value={this.state.contextValue}>
        <Home />
        <ToastContainer theme="colored" autoClose={3000} position="top-center"/>
      </AppContext.Provider>
    );
  }
}
