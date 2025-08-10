const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ping = require('ping');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const TARGET = '8.8.8.8';
const INTERVAL = 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Client connected');
});

setInterval(() => {
  ping.promise.probe(TARGET).then(res => {
    const result = {
      target: TARGET,
      time: Date.now(),
      latency: res.alive ? parseFloat(res.time) : null,
      status: res.alive ? 'online' : 'offline',
    };
    io.emit('pingResult', result);
    console.log(`[${result.status}] ${result.latency || '-'} ms`);
  });
}, INTERVAL);

server.listen(3000, () => {
  console.log('Monitoring started at http://localhost:3000');
});
