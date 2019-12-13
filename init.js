#!/usr/bin/env node

const args = process.argv.slice(2)
const Param = require('./models/param')
const debug = require('debug')('gerador-artefato:server');

const PORT = '3000'
let server = {}

init(args)

function init(args) {

    const params = new Param(args)

    if (params.server) {

        const app = require('./config/express')
        const http = require('http')

        const port = normalizePort(process.env.PORT || PORT);
        app.set('port', port)

        server = http.createServer(app)

        server.listen(port);
        server.on('error', onError)
        server.on('listening', onListening)

        const geradorRouter = require('./routes/gerador')
        app.use('/', geradorRouter)

    } else {

        console.log(params)
    }
}
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
