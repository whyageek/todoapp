import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TODO, UPLOAD_IMAGE } from '../services/mutations';
import { ProContext } from '../context/ProContext';

const ToDoForm = () => {
  const { isPro } = useContext(ProContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);

  const [addToDo, { error: addError }] = useMutation(ADD_TODO);
  const [uploadImage, { error: uploadError }] = useMutation(UPLOAD_IMAGE);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await addToDo({ variables: { title, description, time } });
      const todoId = data.createToDoMutation.todo.id;

      if (isPro && image) {
        await uploadImage({ variables: { todoId, image } });
        alert('To-Do and image uploaded successfully!');
      } else {
        alert('To-Do uploaded successfully!');
      }
    } catch (err) {
      alert(`Error: ${addError || uploadError}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="datetime-local"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      {isPro && <input type="file" accept="image/*" onChange={handleFileChange} />}
      <button type="submit">Add To-Do</button>
    </form>
  );
};

export default ToDoForm;
