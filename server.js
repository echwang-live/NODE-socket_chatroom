var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded());

// Now lets set the view engine itself so that express knows that we are using ejs as opposed to another templating engine like jade
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (req, res){
    console.log('Enter root');
    res.render('index');
})

var server = app.listen(8000, function() {
  console.log("listening on port 8000");
})

var io = require('socket.io').listen(server);
var user_list = new Object();

io.on('connection', function(socket){
    console.log('Connection established');
    console.log(socket.id);

    // Detect new user joined and braodcast to all users to create new user
    socket.on('user_joined', function(data){
        console.log(data.name);
        io.emit('got_new_user', {name: data.name});
        user_list[socket.id] = data.name;
    });

    socket.on('new_msg', function(data){
        console.log(data.msg);
        io.emit('update_msg', {
            name: data.name,
            msg: data.msg});
    })

    socket.on('disconnect', function(){
        console.log('Disconnected');
        console.log(socket.id);

        io.emit('disconnect_user', {name:user_list[socket.id]});
        delete user_list[socket.id];
    })
});

