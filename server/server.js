const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 9000;

// test route
app.get('/', (req, res) => {
  res.send('🚀 FlashShare Signaling Server Running');
});

// IMPORTANT: http server explicitly
const server = http.createServer(app);

// Peer server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/',              // 👈 VERY IMPORTANT
  allow_discovery: true,
});

// mount peer server
app.use('/flashshare', peerServer);

// start server ONCE
server.listen(PORT, () => {
  console.log(`✨ Server running on port ${PORT}`);
});

// logs
peerServer.on('connection', (client) => {
  console.log('Client Connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client Disconnected:', client.getId());
});
