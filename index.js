const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let counter = 0;

server.use((req, res, next) => {
    counter++;
    console.log(counter);

    return next();
})

function checkItemsSent(req, res, next) {
    const { id, title } = req.body;

    if(!id || !title) {
        return res.status(400).send(`Project ${!req.body.id ? 'id' : 'title'} is required`);
    }

    req.project = { id, title };

    return next();
}

function checkIdSent(req, res, next) {
    const { id } = req.params;

    if(!id) {
        return res.status(400).send(`Project id is required`);
    }

    return next();
}

server.get('/projects', (req, res) => {
    return res.json({ projects });
});

server.post('/projects', checkItemsSent, (req, res) => {
    const { project } = req;
    project.tasks = [];

    projects.push(project);

    return res.json(project);
});

server.put('/projects/:id', checkIdSent, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    projects.map(v => {
        if(v.id == id) {
            v.title = title;
        }
    });

    return res.json({ projects });
});

server.delete('/projects/:id', checkIdSent, (req, res) => {
    const { id } = req.params;

    let newProjects = projects.filter(v => {
        return v.id != id;
    });

    return res.json({ projects: newProjects });
});

server.post('/projects/:id/tasks', checkIdSent, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    projects.map(v => {
        if(v.id == id) {
            v.tasks.push(title);
        }
    });
    
    return res.json({ projects });
});

server.listen(3000);