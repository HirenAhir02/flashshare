const express = require('express');
const { ExpressPeerServer } = require('peer');
const app = express();
const port = 9000;

app.get('/', (req, res) => {
  res.send('FlashShare Signaling Server is Running... 🚀');
});

const server = app.listen(port, () => {
  console.log(`✨ FlashShare Server running on port ${port}`);
});

// const peerServer = PeerServer({
//   port: 9000,
//   path: '/flashshare',
//   allow_discovery: true
// });
const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
});

peerServer.on('connection', (client) => {
  console.log(`Client Connected: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`Client Disconnected: ${client.getId()}`);
});

console.log('📡 P2P Signaling active on port 9001');

