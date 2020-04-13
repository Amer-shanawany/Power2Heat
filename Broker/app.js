const express = require('express');
const app = express()
const expressLayouts = require('express-ejs-layouts')
const monogoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const flash = require('connect-flash');
const session = require('express-session');
const broker = require('broker');
const passport = require('passport');

// Passport config
require('./config/passport')(passport);
//const sub = require('sub')
//app.get('/',(req,res)=> res.send('Hello containers world!'))

//DB config 

const db_uri = require('./config/keys').MongoURI;
const db = require('./modules/User').User;
//connect to Mongo
 
monogoose.connect(db_uri,{useNewUrlParser:true, useUnifiedTopology: true})
    .then(()=> {
        console.log('MongoDB is connected ... ')
})
    .catch(err=>console.log(err))

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser 
app.use(express.urlencoded({extended:false}))

//Express session middleware 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true 
  }));

//PassportJs middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes 
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

broker()
//sub()

app.listen(PORT,console.log(`Server is runnuing on port ${PORT}`));
