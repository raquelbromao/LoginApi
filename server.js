var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var BD = require('./app/Models/LoginModel'); //created model loading here

//  mongoose instance connection url connection
mongoose.connect('mongodb://localhost/loginDB', function(err) {
  if (err) {
    console.log('connection error', err);
  }  else {
    console.log('connection with database successful');
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + '/app/Views');
app.set('view engine', 'ejs');    // Setamos que nossa engine será o ejs

var routes = require('./app/Routes/LoginRoute'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Login RESTful API server started on: ' + port);

//var Usuario = mongoose.model('Usuarios');

/*var userTest = new  Usuario ({
    name: "admin",
    password: "123456"
});*/

/*userTest.save(function(err, data){
  if (err) {
    console.log(error);
  } else {
     console.log ('Success:' , data);
  }
});*/
