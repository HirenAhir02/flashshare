const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT || 9000;

// test route
app.get('/', (req, res) => {
  res.send('🚀 FlashShare Server Running');
});

// start express server
const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// ⚠️ DO NOT set port here
const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true,
});

// mount peer server
app.use('/flashshare', peerServer);

// logs
peerServer.on('connection', (client) => {
  console.log('Peer Connected:', client.getId());
});
