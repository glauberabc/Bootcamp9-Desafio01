const express = require('express');

const server = express();

server.use(express.json());

server.listen(3000);

const projects = [{id: "1", title: "Proj Casa", tasks: ["Tarefa 1", "Tarefa 2"]},
                  {id: "2", title: "Proj Sala", tasks: ["Tarefa 3", "Tarefa 4"]}];

let qtdReq = 0;

function numOfReqs(req, res, next) {
  qtdReq++;

  console.log(`Quantidade de requisições: ${qtdReq}`);

  return next();
}

/**
 * ESSA É A MELHOR FORMA DE USAR UM MIDDLEWARE 
 * QUE DEVE SER CHAMADO EM TODAS AS REQUISIÇOES
 *  EU PASSEI O MIDDLEWARE EM TODAS AS ROTAS, MAIS DEPOIS VI NO CÓDIGO
 * DA ROCKETSEAT E VI ELES FAZENDO DESSA FORMA
 */
//server.use(numOfReqs);

function checkId(req, res, next) {
  const {id} = req.params;
  const project = projects.find(p => p.id == id);
  const index = projects.findIndex(p => p.id == id);

  if (!project)
    return res.status(400).json({error: 'Project does not exists'});

  req.proj = project;
  req.index = index;

  return next();
}

server.get('/projects', numOfReqs, (req, res) => {
  return res.json(projects);
});

server.get('/projects/:id', numOfReqs, checkId, (req, res) => {
  return res.json(req.proj);  
});

server.post('/projects', numOfReqs, (req, res) => {
  const {id} = req.body;
  const {title} = req.body;

  const project = {
    id,
    title,
    task: []
  }

  projects.push(project);

  return res.json(projects);
});

server.post('/projects/:id/task', numOfReqs, checkId, (req, res) => {
  const {title} = req.body;

  projects[req.index].tasks.push(title);

  return res.json(projects);
})

server.delete('/projects/:id', numOfReqs, checkId, (req, res) => {  
  projects.splice(req.index, 1);
  return res.send();
});

server.put('/projects/:id', numOfReqs, checkId, (req, res) => {
  const {title} = req.body;

  req.proj.title = title;
  projects[req.index] = req.proj;

  return res.json(projects);
});