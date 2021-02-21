#!/usr/bin/env node
/**
 * Module dependencies.
 */
import debug from 'debug';
import http from 'http';
import app from '../app';

/**
 * Normalize a port into a number, string, or false.
 */
const normalizePort = val => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3006');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = error => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        alert(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        alert(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  };
  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port, () => {
    console.log(`listening on port ${port} ...... `)});
  server.on('error', onError);
  server.on('listening', onListening);

var confirmLogs = []
  
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
io  
  .of('/authentication')
  .on("connection", (socket) => {
    console.log("New player")
    socket.emit("welcome", "Canal de autenticacion llave para aplicacion de escritorio")

    socket.on("joinRoom", (room) => {
      socket.join(room)
      confirmLogs.push({id:room,log:false})
      console.log("www: linea numero 92",confirmLogs)
      return socket.emit("success", "Se ha unido a su room personal de autenticacion para aplicacion de escritorio")
    })
    socket.on("userConfirmed", (room) => {
      console.log("www: linea numero 96",room)
      console.log("www: linea numero 97",confirmLogs)
      let user_index;
      confirmLogs.forEach((user,index) => {
        if(user.id === room){
          user_index = index
        }        
      });      
      console.log("www: linea numero 104",user_index)
      console.log("www: linea numero 105",confirmLogs)
      if(user_index !== undefined && confirmLogs !== undefined && confirmLogs[user_index] !== undefined){
        confirmLogs[user_index].log = true
      }
      console.log("www: linea numero 107",confirmLogs)
      app.locals.index = user_index

    })
  })
app.locals.io = io

export default confirmLogs;