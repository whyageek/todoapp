import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_TODOS } from '../services/queries';
import { DELETE_TODO, EDIT_TODO } from '../services/mutations';

const ToDoList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_TODOS);
  const [deleteToDo] = useMutation(DELETE_TODO);
  const [editToDo] = useMutation(EDIT_TODO);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTime, setEditTime] = useState('');

  if (loading) return <p>Loading To-Dos...</p>;
  if (error) return <p>Error loading To-Dos: {error.message}</p>;

  const handleDelete = async (id) => {
    try {
      await deleteToDo({ variables: { id } });
      alert('To-Do deleted successfully');
      refetch();
    } catch (err) {
      alert('Error deleting To-Do');
    }
  };

  const handleEdit = (id, title, description, time) => {
    setEditId(id);
    setEditTitle(title);
    setEditDescription(description);
    setEditTime(time);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editToDo({
        variables: { id: editId, title: editTitle, description: editDescription, time: editTime },
      });
      alert('To-Do updated successfully');
      setEditId(null);
      refetch();
    } catch (err) {
      alert('Error updating To-Do');
    }
  };

  return (
    <ul>
      {data.allTodos.map((todo) => (
        <li key={todo.id}>
          {editId === todo.id ? (
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <input
                type="datetime-local"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditId(null)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h3>{todo.title}</h3>
              <p>{todo.description}</p>
              <p>{todo.time}</p>
              <button onClick={() => handleEdit(todo.id, todo.title, todo.description, todo.time)}>
                Edit
              </button>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ToDoList;
