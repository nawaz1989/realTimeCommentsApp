var express = require('express');
var socket = require('socket.io');

var app = express();
var PORT = 8081;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
    res.render('index');
});

var io = socket.listen(app.listen(PORT));

io.sockets.on('connection', function(socket) {
    socket.emit('post', {message: ''});
    socket.on('send', function(data) {
        io.sockets.emit('post', data);
    });
});

console.log('Listening to port 8081');