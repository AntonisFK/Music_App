// require express 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser')
var passport = require('passport')
var bodyParser = require('body-parser');
var morgan = require('morgan');
var session = require('express-session');


var app = express();

// configuration============================================

//config routes and database 
require('./server/config/mongoose.js');
// pass app 
require('./server/config/routes.js')(app);

//pass passport for config 
require('./server/config/passport.js')(passport)


app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());


app.use(session({secret: "Knowthyself,knowthyenemy.Athousandbattles, a thousandvictories"}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, './client')));




app.listen(3000, function(){
  console.log("Music App running on port 3000")
})