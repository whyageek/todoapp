import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  const handleLogout = () => {
    // Call Keycloak logout logic
    alert("Logged out!");
  };

  return (
    <nav>
      <h1>To-Do App</h1>
      <div>
        {isAuthenticated && (
          <>
            <Link to="/">Home</Link>
            <Link to="/pro">Pro Features</Link>
            <span>Welcome, {user?.preferred_username || 'User'}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {!isAuthenticated && <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
