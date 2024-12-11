import React, { useState, useEffect } from 'react';
import './App.css'; // Certifique-se de criar e usar um arquivo CSS para o layout

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskStatus, setTaskStatus] = useState('to-do'); // Estado para status da tarefa

  useEffect(() => {
    // Requisição para o backend para obter tarefas
    fetch('http://localhost:3001/tasks') // URL do backend
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    const task = { text: newTask, status: taskStatus };
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
        setTasks([...tasks, data]); // Atualiza a lista de tarefas com a nova
        setNewTask(''); // Limpa o campo de input
      })
      .catch(error => console.error('Error adding task:', error));
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          placeholder="Enter a new task..."
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select onChange={(e) => setTaskStatus(e.target.value)} value={taskStatus}>
          <option value="to-do">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="task-columns">
        {['to-do', 'in-progress', 'done'].map((status) => (
          <div key={status} className={`task-column ${status}`}>
            <h2>{status.replace('-', ' ').toUpperCase()}</h2>
            <ul>
              {tasks
                .filter((task) => task.status === status)
                .map((task, index) => (
                  <li key={index}>{task.text}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
