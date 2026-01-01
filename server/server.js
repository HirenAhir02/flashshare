const express = require('express');
const app = express();

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('🚀 FlashShare Backend Alive');
});

app.listen(PORT, () => {
  console.log('Server started on port', PORT);
});
