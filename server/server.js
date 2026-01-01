const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT;   // 🚨 VERY IMPORTANT

app.get('/', (req, res) => {
  res.send('🚀 FlashShare Server Running');
});

// START SERVER ON RAILWAY PORT
const server = app.listen(PORT, () => {
  console.log('Server running on', PORT);
});

// Attach peer server
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/flashshare', peerServer);

peerServer.on('connection', (client) => {
  console.log('Peer Connected:', client.getId());
});
