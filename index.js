const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const dotenv=require('dotenv').config();
const cors=require('cors');
const bodyParser=require('body-parser');
const app = express();
require('./config/passport')(passport);
// const db = require('./config/keys').mongoURI;
const PORT = process.env.PORT|| 5000;
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());
app.use( express.static( "public" ) );
mongoose.connect(process.env.MONGODB_URI,
   { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(`${error} did not connect`));
 
  // mongoose
  // .connect(
  //   db,
  //   { useNewUrlParser: true ,useUnifiedTopology: true}
  // )
  // .then(() => console.log('MongoDB Connected'))
  // .catch(err => console.log(err));

mongoose.set('useFindAndModify', false);
// Connect to MongoDB
// mongoose
//   .connect(
//     db,
//     { useNewUrlParser: true ,useUnifiedTopology: true}
//   )
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// // Express body parser
app.use(express.urlencoded({ extended: true }));

// // Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// // Connect flash
 app.use(flash());

// // Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));


app.listen(PORT, console.log(`Server running on  ${PORT}`));