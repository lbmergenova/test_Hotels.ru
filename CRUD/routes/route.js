const url = require('url');
const   {
    sendResponse,
    userRoutes
} = require('./userRoutes');

const routeHandler = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    if (path === '/users' || path.startsWith('/users/')) {
        userRoutes(req, res)
    } else {        
        sendResponse(res, 404, {message: 'Route not found'})
    }
};

module.exports = routeHandler;
