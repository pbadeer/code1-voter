var app = require('express')();
var http = require('http').Server(app);
var path = require('path');

app.get('/:dir/:file', function(req, res){
  res.sendFile(path.join(__dirname, req.params.dir, req.params.file));
}).get('/:file', function(req, res){
  res.sendFile(path.join(__dirname, req.params.file));
}).get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
