// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get('http://localhost:8000/api/items/');
    setItems(response.data);
  };

  const handleCreate = async () => {
    await axios.post('http://localhost:8000/api/items/', { name, description });
    fetchItems();
    setName('');
    setDescription('');
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/items/${id}/`);
    fetchItems();
  };

  const handleEdit = async (id) => {
    // Pobierz dane do edycji
    const itemToEdit = items.find(item => item.id === id);
    if (itemToEdit) {
      setName(itemToEdit.name);
      setDescription(itemToEdit.description);
      setEditingId(id);
    }
  };

  const handleUpdate = async () => {
    // Wyślij zaktualizowane dane
    await axios.put(`http://localhost:8000/api/items/${editingId}/`, { name, description });
    fetchItems();
    setName('');
    setDescription('');
    setEditingId(null);
  };

  return (
    <div>
      <h1>CRUD App</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - {item.description}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
            <button onClick={() => handleEdit(item.id)}>Edit</button>
          </li>
        ))}
      </ul>
      <div>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        {editingId ? (
          <button onClick={handleUpdate}>Update</button>
        ) : (
          <button onClick={handleCreate}>Create</button>
        )}
      </div>
    </div>
  );
}

export default App;
