import server from './server';

const port = process.env.PORT || 5000;

server.listen(port, function () {
  console.log('Server running on port %d', port);
});
