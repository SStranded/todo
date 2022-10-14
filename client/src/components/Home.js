import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const generateID = () => Math.random().toString(36).substring(2, 10);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('_username', username);
    localStorage.setItem('_id', generateID());
    setLoggedIn(true);
    navigate('/app');
  };

  return (
    <div className="home">
      <h2>Sign in to your todo-list</h2>
      <form onSubmit={handleSubmit} className="home_form">
        <label htmlFor="username">Your Username</label>
        <input
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          className="input"
        />
        <button>SIGN IN</button>
      </form>
    </div>
  );
};
export default Home;
