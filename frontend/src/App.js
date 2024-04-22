import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import SignIn from './pages/SignIn';



function App() {

  useEffect(() => {
    fetch('http://localhost:3002/api/data') // Make sure the URL matches your Express server's address
      .then(response => response.json())
      .then(data => {
        console.table('Movie data:', data); // Logs fetched data to the console
      })
      .catch(error => console.error('Error fetching data:', error));
    console.log("Hey?")
  }, []);

  return (
    <div className="App">
      <SignIn />  // Use SignIn component here

    </div>
  );
}

export default App;
