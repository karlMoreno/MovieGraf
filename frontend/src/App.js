import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';



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
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
