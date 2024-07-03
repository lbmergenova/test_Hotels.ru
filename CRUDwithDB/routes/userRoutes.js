const data = require('../data'); 

const sendResponse = (res, statusCode, body) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
};

const userRoutes = (req, res) => {
    const { method, url } = req;
    const urlParts = url.split('/');
    const id = url.split('/').length === 3 ? parseInt(urlParts[2]) : NaN;
    if (url.startsWith('/users/') && !id) {
        sendResponse(res, 404, {message: 'Not found'});
        return ;
    }
    switch (method) {
        case 'GET':
            if (id) {
                getUserById(req, res, id);
            } else {
                getUsers(req, res);
            }
            break;
        case 'POST':
            createUser(req, res);
            break;
        case 'PUT':
            updateUser(req, res, id);
            break;
        case 'DELETE':
            deleteUser(req, res, id);
            break;
        default:
            sendResponse(res, 404, {message: 'Not found'});
    }
};

// Обработчик для GET запросов на /users
const getUsers = async (req, res) => {
    sendResponse(res, 200, await data.getUsers());
};

// Обработчик для POST запросов на /users
const createUser = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', async () => {
        const parseBody = new URLSearchParams(body);
        const name = parseBody.get("name");
        const age = parseInt(parseBody.get("age"));
        if (name && age) {
            sendResponse(res, 201, await data.addUser({name, age}));
        } else {
            sendResponse(res, 400, {message: 'Name and age are required'});
        }
    });
};


// Обработчик для GET запросов на /users/:id
const getUserById = async (req, res, id) => {
    const user = await data.getUserById(id);
    if (user) {
        sendResponse(res, 200, user)
    } else {
        sendResponse(res, 404, {message: 'User not found'});
    }
};

// Обработчик для PUT запросов на /users/:id
const updateUser = (req, res, id) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk;
    });
    req.on('end', async () => {
        const parseBody = new URLSearchParams(body);
        const name = parseBody.get("name");
        const age = parseInt(parseBody.get("age"));
        if (name && age) {
            const updatedUser = await data.updateUser(id, {name, age});
            if (updatedUser) {
                sendResponse(res, 200, updatedUser)
            } else {
                sendResponse(res, 404, {message: 'User not found'});
            }
        } else {
            sendResponse(res, 400, {message: 'Name and age are required'});
        }
    });
};

// Обработчик для DELETE запросов на /users/:id
const deleteUser = async (req, res, id) => {
    const isDelete = await data.deleteUser(id)
    if (isDelete) {
        sendResponse(res, 204);
    } else {
        sendResponse(res, 404, {message: 'User not found!'});
    }
};

module.exports = {
    sendResponse,
    userRoutes
};