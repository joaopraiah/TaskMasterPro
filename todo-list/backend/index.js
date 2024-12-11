const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors()); // Permite todas as origens
app.use(express.json());

let tasks = [];

// Rota para obter tarefas
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Rota para adicionar tarefas
app.post('/tasks', (req, res) => {
    const task = req.body;
    tasks.push(task);
    res.status(201).json(task);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
