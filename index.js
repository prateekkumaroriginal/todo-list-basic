const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
const port = 3000;

function findIndex(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) return i;
    }
    return -1;
}

app.get('/todos', (req, res) => {
    fs.readFile('todos.txt', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.get('/todos/:id', (req, res) => {
    let id = parseInt(req.params.id);
    fs.readFile('todos.txt', 'utf8', (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        const index = findIndex(todos, id);
        if (index !== -1) {
            res.json(todos[index]);
        } else {
            res.sendStatus(404);
        }
    });
});

app.post('/todos', (req, res) => {
    fs.readFile('todos.txt', 'utf8', (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        const newTodo = {
            "id": Math.floor(Math.random() * 1000000),
            "title": req.body.title,
            "description": req.body.description,
        }
        todos.push(newTodo);
        fs.writeFile('todos.txt', JSON.stringify(todos), (err) => {
            if (err) throw err;
            res.status(201).json(newTodo);
        });
    });
});

app.put('/todos/:id', (req, res) => {
    let id = parseInt(req.params.id);
    fs.readFile('todos.txt', 'utf8', (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        const index = findIndex(todos, id);
        if (index !== -1) {
            const updateTodo = req.body;
            for (let key in updateTodo) {
                todos[index][key] = updateTodo[key];
            }
            fs.writeFile('todos.txt', JSON.stringify(todos), (err) => {
                if (err) throw err;
                res.status(200).send(todos[index]);
            });
        } else {
            res.sendStatus(404);
        }
    });
});

app.delete('/todos/:id', (req, res) => {
    let id = parseInt(req.params.id);
    fs.readFile('todos.txt', 'utf8', (err, data) => {
        if (err) throw err;
        const todos = JSON.parse(data);
        const index = findIndex(todos, id)
        if (index !== -1) {
            todos.splice(index, 1);
            fs.writeFile('todos.txt', JSON.stringify(todos), (err) => {
                if (err) throw err;
                res.status(200).send({id: id});
            });
        } else {
            res.sendStatus(404);
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`App listening on http://127.0.0.1:${port}`);
});