const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const errorController = require('./controllers/error');
const cors = require('cors');
var fs = require('fs');
var https = require('https');


const app = express();

const MONGODB_URI = "mongodb+srv://Chevaliers:toor@cluster0.icyec.mongodb.net/nature?retryWrites=true&w=majority"
// initialize session
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine','ejs');
app.set('views','views');

// import routes
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main');
const apiRoutes = require('./routes/api');

//serving file statically
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'ssl')));

// use routes
app.use(
    session({
      secret: 'IYq@9A2SAjuk$sg$YJiKzz@c0%B',
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        httpOnly : true,
        sameSite : 'none',
        secure : true,
        maxAge: 10 * 60 * 1000 //cookie expired in 10 minutes
      }
    })
);



app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use('/api/profile', (req,res,next) => {
  const origin = req.get('origin');
  if(origin){
    res.setHeader('Access-Control-Allow-Origin' , origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
    res.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");
  }
  next();
})

app.use(authRoutes);
app.use(mainRoutes);
app.use('/api',apiRoutes);


//error handling on api endpoint
app.use('/api',(error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({message : message});
})


const key = fs.readFileSync(path.join(__dirname, 'ssl', 'server.key'));
const cert = fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt'));
const ca = fs.readFileSync(path.join(__dirname, 'ssl', 'server.ca-bundle'));

https.createServer({
 key: key,
 cert: cert
}, app)
.listen(443, function () {
 mongoose
 .connect(MONGODB_URI)
 .then(result => {
   
 })
 .catch(err => {
   console.log(err);
 });
})


