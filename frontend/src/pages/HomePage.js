import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import ToDoForm from '../components/ToDoForm';
import ToDoList from '../components/ToDoList';
import { AuthContext } from '../context/AuthContext';
import { ProContext } from '../context/ProContext';

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isPro } = useContext(ProContext);

  if (!isAuthenticated) {
    return <p>Please log in to access your To-Do List.</p>;
  }

  return (
    <div>
      <Navbar />
      <h1>To-Do List</h1>
      {!isPro && (
        <div>
          <h2>Upgrade to Pro</h2>
          <p>Unlock image uploads with Pro!</p>
        </div>
      )}
      <ToDoForm isPro={isPro} />
      <ToDoList />
    </div>
  );
};

export default HomePage;
