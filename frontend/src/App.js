import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Projects from './pages/Projects';
import AssetPage from './components/dashboard/AssetsPage';
import TestPage from './pages/TestPage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard/:projectId" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/assets" element={<AssetPage />} />
        <Route 
          path="/test" 
          element={
            <DndProvider backend={HTML5Backend}>
              <TestPage />
            </DndProvider>
          } 
        />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
