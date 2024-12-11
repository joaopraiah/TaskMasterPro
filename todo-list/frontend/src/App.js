import React, { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    // Requisição para o backend para obter tarefas
    fetch('http://localhost:3001/tasks')  // URL do backend
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);  // O array vazio garante que a requisição só ocorra uma vez, ao carregar

  const addTask = () => {
    const task = { text: newTask };
    // Enviar a nova tarefa para o backend
    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, data]);  // Atualiza a lista de tarefas com a nova
        setNewTask('');  // Limpa o campo de input
      })
      .catch(error => console.error('Error adding task:', error));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.text}</li>
        ))}
      </ul>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={addTask}>Add Task</button>
    </div>
  );
}

export default App;
