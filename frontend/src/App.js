import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';


function App() {

  useEffect(() => {
    fetch('http://localhost:3002/api/data') // Make sure the URL matches your Express server's address
      .then(response => response.json())
      .then(data => {
        console.log('Movie data:', data); // Logs fetched data to the console
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
