const http = require('http')
const routeHandler = require('./routes/route');

const server = http.createServer(routeHandler);

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// run with `node server.js`
