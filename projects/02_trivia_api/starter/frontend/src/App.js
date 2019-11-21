import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

// import logo from './logo.svg';
import './stylesheets/App.css';
import QuestionView from './components/QuestionView';


class App extends Component {
  render() {
    return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={QuestionView} />
        </Switch>
      </Router>
    </div>
  );

  }
}

export default App;
