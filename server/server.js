const express = require('express');
const { PeerServer } = require('peer');
const app = express();
const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
  res.send('FlashShare Signaling Server is Running... 🚀');
});

const server = app.listen(PORT, () => {
  console.log(`✨ FlashShare Server running on port ${PORT}`);
});

const peerServer = PeerServer({
  port: PORT,
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
