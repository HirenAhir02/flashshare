const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');

const app = express();

// ✅ Allow requests from your frontend Vercel URL
app.use(cors({
  origin: 'https://flashshare-git-main-hirens-projects-74607a7c.vercel.app', 
  methods: ['GET', 'POST']
}));

// Railway dynamic port
const PORT = process.env.PORT || 3000;

// Test route
app.get('/', (req, res) => {
  res.send('🚀 FlashShare Signaling Server Running');
});

// Start HTTP server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ FlashShare Server running on port ${PORT}`);
});

// Attach PeerJS to same server
const peerServer = ExpressPeerServer(server, {
  path: '/flashshare',
  allow_discovery: true,
  debug: true
});

app.use('/flashshare', peerServer);

// PeerJS events
peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});
peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});
