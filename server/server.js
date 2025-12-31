const express = require('express');
const { PeerServer } = require('peer');
const app = express();
const port = process.env.PORT || 9001;

app.get('/h', (req, res) => {
  res.send('FlashShare Signaling Server is Running... 🚀');
});

const server = app.listen(port, () => {
  console.log(`✨ FlashShare Server running on port ${port}`);
});

const peerServer = PeerServer({
  port: 9001,
  path: '/flashshare',
  allow_discovery: true
});

peerServer.on('connection', (client) => {
  console.log(`Client Connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`Client Disconnected: ${client.getId()}`);
});

console.log('📡 P2P Signaling active on port 9001');

