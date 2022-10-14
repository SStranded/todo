import React, { useState, useEffect } from 'react';
import socketIO from 'socket.io-client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Main from './components/Main';
import Home from './components/Home';
import './App.css';

const socket = socketIO.connect('http://localhost:4000');

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let user = localStorage.getItem('_username');
    let userId = localStorage.getItem('_id');

    if (user && userId) {
      setLoggedIn(true);
    }
  }, [loggedIn]);

  const LogInWrapper = ({ children, loggedIn }) => {
    return loggedIn ? <Navigate to="/app" replace /> : children;
  };

  const LogOutWrapper = ({ children, loggedIn }) => {
    return loggedIn ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LogInWrapper loggedIn={loggedIn}>
              <Home setLoggedIn={setLoggedIn} />
            </LogInWrapper>
          }
        />
        <Route
          path="/app"
          element={
            <LogOutWrapper loggedIn={loggedIn}>
              <Main socket={socket} />
            </LogOutWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
