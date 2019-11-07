var express = require('express');
var ejs = require('ejs');
var path = require('path');

var app = express();


var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const PORT = 3000;
server.listen(PORT);

mongoose.connect('mongodb://localhost/ee', { useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/user');
var questionRoutes = require('./routes/question');
app.use('/users', index);
app.use('/questions', questionRoutes);


// // error handler
// // define as the last app.use callback
// app.use(function (err, req, res, next) {
//   res.status(err.status || 500);
//   res.send(err.message);
// });

//Whenever someone connects this gets executed


// listen on port 3000
app.listen(3001, function () {
  console.log('Express app listening on port 3000');
});


const connections = [];

io.sockets.on('connection',(socket) => {
   connections.push(socket);
   console.log(' %s sockets is connected', connections.length);
});

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error('File Not Found');
//   err.status = 404;
//   next(err);
// });
