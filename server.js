const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const session = require('express-session');

const env = require('dotenv');
const exphbs = require('express-handlebars');




const TeleSignSDK = require('telesignsdk');
const client  = new TeleSignSDK("13627871-8397-47F8-9C50-4E710B3CC1DE", "GNM5wQGLCETZoz6qlhVnGj5HN4dme131t7fxaE2E2m+G28k/mIRAiBedaA6Ix8DPOr03R98mQl/2O0yYnpUvfQ==");

callback = function(err, resBody){
    if(err){
        console.log(err)
    }else{
        console.log("success!!");
        console.log(resBody);
    }
}

const PORT = process.env.PORT || 3000
const db = require("./models");

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static('public'));


// For Handlebars
app.engine(`handlebars`, exphbs({
    defaultLayout: `main`
}));
app.set(`view engine`, `handlebars`);

app.get('/signin', function (req, res) {
    client.sms.message(callback, '+18329023510', 'Someone logged into your account', 'MKT');
    res.render('signin');
  
});

app.get('/signup', function (req, res) {
    client.sms.message(callback, '+18329023510', 'Thank you for signing up', 'MKT');
    res.render('signup');
   
});

// ROUTES
require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);
require('./routes/passport.js')(passport, db.user);
require('./routes/auth.js')(app, passport);

// For Passport
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



db.sequelize.sync({}).then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});






