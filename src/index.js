const express = require('express');
const {uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * Metodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end 
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parametros:
 * 
 * Query Oarams: Filtros e paginação
 * Route Params: Identificar recursos (att/ deletar)
 * Request Body: Conteudo na hora de Criar ou editar um recurso (JSON)
 */

/**
 * Middleware:
 * 
 * Interceptador de Requisições que interromper totalmente a requisição ou pode alterar dados da requisição
 */


const projects = [];

function logRequests(request, response, next){
    const {method, url } = request;

    const loglabel = `[${method.toUpperCase()}] ${url}`;

    console.log(loglabel);

    return next(); //proximo middleware
}

function validateProjectId(request, response, next){
    const { id } = request.params;

    if(!isUuid(id)){
        return response.status(400).json({error: 'Invalid project ID.'});
    }

    return next();
}

app.use(logRequests);  //para todos
app.use('/projects/:id', validateProjectId); //para todos que tem '/projects/:id'


app.get('/projects', /*logRequests,*apenas dentro*/ (request, response) => {
    const { title } =  request.query;

    const results = title 
     ? projects.filter(project => project.title.includes(title))
     : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {
    const {title, owner} = request.body;

    const project = {id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner} = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0){
        return response.status(400).json({error: 'Project not found.'})
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0){
        return response.status(400).json({error: 'Project not found.'})
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});


app.listen(3033, () => {
    console.log('🚀 Back-end started!🚀');
});