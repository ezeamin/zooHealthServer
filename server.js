require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');

const app = express();
const routes = require('./routes/index');
require('./database/database');
require('./passport/auth-login');

//settings
app.set('port', process.env.PORT || 5000);

//middlewares
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'mysecretapp',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'https://zoohealth.netlify.app/'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  return next();
});

//routes
app.use(routes);

app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});