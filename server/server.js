const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
  res.send('🚀 FlashShare Signaling Server is Running');
});

// start express
const server = app.listen(PORT, () => {
  console.log(`✨ Server running on port ${PORT}`);
});

// attach peer server
const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
});

// 🔴 THIS WAS MISSING
app.use('/flashshare', peerServer);

// logs
peerServer.on('connection', (client) => {
  console.log('Client Connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client Disconnected:', client.getId());
});
