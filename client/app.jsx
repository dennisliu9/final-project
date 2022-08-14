import React from 'react';
import Home from './pages/home';
import AppContext from './lib/app-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 1
    };
  }

  render() {

    const contextValue = { userId: this.state.userId };

    return (
    <AppContext.Provider value={contextValue}>
      <Home />;
    </AppContext.Provider>
    );
  }
}

App.contextType = AppContext;
Home.contextType = AppContext;
