import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Загрузка задач из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('todo-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Сохранение в localStorage при изменении задач
  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === '') return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
    };
    setTasks([...tasks, newTask]);
    setInput('');
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editId ? { ...task, text: editText.trim() } : task
      )
    );
    setEditId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editId) {
        saveEdit();
      } else {
        addTask();
      }
    }
  };

  return (
    <div className="container">
      <h1>Заметки</h1>

      <div className="input-group">
        {editId ? (
          <>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="edit-input"
              autoFocus
            />
            <button onClick={saveEdit}>Сохранить</button>
            <button onClick={cancelEdit}>Отмена</button>
          </>
        ) : (
          <>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Добавить заметку..."
            />
            <button onClick={addTask}>Добавить</button>
          </>
        )}
      </div>

      <ul>
        {tasks.length === 0 ? (
          <li style={{ textAlign: 'center', color: '#999', fontStyle: 'italic' }}>
            Нет заметок
          </li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className={editId === task.id ? 'editing' : ''}>
              {editId === task.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                </>
              ) : (
                <span>{task.text}</span>
              )}
              <div>
                {editId === task.id ? (
                  <>
                    <button onClick={saveEdit}>✔</button>
                    <button onClick={cancelEdit}>✖</button>
                  </>
                ) : (
                  <>
                    <button className="edit" onClick={() => startEdit(task)}>
                      ✏️
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteTask(task.id)}
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;
