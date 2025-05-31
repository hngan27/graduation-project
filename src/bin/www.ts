#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../index';
import debugLogger from 'debug';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { AppDataSource } from '../config/data-source';
import { ChatMessage } from '../entity/chatMessage.entity';
import { onlineUsers, socketToUser } from '../utils/onlineUsers';

const debug = debugLogger('naitei2024_e-learning:server');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

// Socket.IO setup
const io = new SocketIOServer(server);
io.on('connection', socket => {
  socket.on('join', (userId: string) => {
    socket.join(userId);
    onlineUsers.add(userId);
    socketToUser.set(socket.id, userId);
  });
  socket.on('disconnect', () => {
    const userId = socketToUser.get(socket.id);
    if (userId) {
      onlineUsers.delete(userId);
      socketToUser.delete(socket.id);
    }
  });
  socket.on('private message', async ({ content, to, senderId }) => {
    const chatRepo = AppDataSource.getRepository(ChatMessage);
    // Create message and assign relations
    const msg = new ChatMessage({ content });
    msg.sender = { id: senderId } as any;
    msg.recipient = { id: to } as any;
    const saved = await chatRepo.save(msg);
    io.to(to).to(senderId).emit('private message', saved);
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  const port = parseInt(val, 10);

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

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr!.port;
  debug('Listening on ' + bind);
}
