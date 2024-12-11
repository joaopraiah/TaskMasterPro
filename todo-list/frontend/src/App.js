import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [taskStatus, setTaskStatus] = useState('to-do');

  useEffect(() => {
    fetch('http://localhost:3001/tasks')
      .then(response => response.json())
      .then(data => setTasks(data))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const addTask = () => {
    const task = { text: newTask, status: taskStatus, id: Date.now().toString() }; // Usar toString para garantir que é uma string
    fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
      .then(response => response.json())
      .then(data => {
        setTasks([...tasks, data]);
        setNewTask('');
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const deleteTask = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE',
      })
        .then(() => {
          setTasks(tasks.filter(task => task.id !== taskId)); // Remover apenas a tarefa selecionada
        })
        .catch(error => console.error('Error deleting task:', error));
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // Se não for soltar em lugar nenhum, não faz nada

    // Se a tarefa for movida para o mesmo lugar, não faz nada
    if (source.index === destination.index && source.droppableId === destination.droppableId) {
      return;
    }

    const updatedTasks = [...tasks];
    const [removed] = updatedTasks.splice(source.index, 1); // Remove a tarefa da posição original
    removed.status = destination.droppableId; // Atualiza o status da tarefa
    updatedTasks.splice(destination.index, 0, removed); // Insere a tarefa na nova posição

    setTasks(updatedTasks); // Atualiza o estado com as novas posições
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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-columns">
          {['to-do', 'in-progress', 'done'].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  className={`task-column ${status}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2>{status.replace('-', ' ').toUpperCase()}</h2>
                  <ul>
                    {tasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="task-item"
                            >
                              {task.text}
                              <button
                                onClick={() => deleteTask(task.id)}
                                className="delete-button"
                                style={{ backgroundColor: 'red', color: 'white', borderRadius: '5px', padding: '5px', marginLeft: '10px' }}
                              >
                                Delete
                              </button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                  </ul>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
