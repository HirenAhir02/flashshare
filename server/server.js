const express = require('express');
const { ExpressPeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
  res.send('ROOT OK');
});

const server = app.listen(PORT, () => {
  console.log('Server running on', PORT);
});

const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/flashshare', peerServer);

peerServer.on('connection', (client) => {
  console.log('PEER CONNECTED:', client.getId());
});
