const mongoose = require('mongoose')
const cors = require('cors')
const express = require('express')
var path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();
const port = 8000;

app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const uri = "mongodb+srv://root:artofwar@cluster0-c5dov.gcp.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri,{
    useNewUrlParser : true,
    useCreateIndex : true
});

const connection = mongoose.connection;

connection.once('open', ()=> console.log('Database connection opened successfully!'))


app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: connection
    })
  }));
  
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	


  
app.use(express.static(__dirname + '/views'));

var userRoutes = require('./routes/user');
app.use('/users', userRoutes);
  
// catch 404 and forward to error handler
app.use(function (req, res, next) {
var err = new Error('File Not Found');
err.status = 404;
next(err);
});
  
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
res.status(err.status || 500);
res.send(err.message);
});



app.listen(port, ()=>{
    console.log('Running...')
})


