import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TranscriptPage from './components/TranscriptPage';
import InputPage from './components/InputPage';
import Buffer from './components/Buffer';

function App() {

  return (
      <div className="app">
          <TranscriptPage/>
      </div>
      );
}

export default App;
