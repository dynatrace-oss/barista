const express = require('express');
const server = express();

const port = process.env.PORT || 4000;

if (process.env.FAKE_ERROR) {
  throw new Error('FAKED ERROR');
}

server.get('/error', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  throw new Error('ERROR inside route');
});

server.get('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.send('<html></html>');
});

server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});
