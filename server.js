const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const store = require("connect-mongo");
const dotenv = require("dotenv");
/* const passport = require('passport')
const override = require('method-override') */

// environment variables
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('MongoDB is connected')
}).catch(err => console.log(err))

const app = express();

// template engine setup
app.set("view engine", "ejs");
// ejs layout setup
app.use(expressLayouts);
// middleware to extract the body from the request
app.use(express.urlencoded({ extended: false }));
// hooking up the public folder
app.use(express.static("public"));



/* app.use(override('_method')) */

/* require('./config/google.passport')(passport); */

// middleware for setting up the session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1200000,
    },
    store: store.create({
      mongoUrl: process.env.MONGO_DB_URL,
    }),
  })
);

/* app.use(passport.initialize())
app.use(passport.session()) */

// middleware for making the user available to all templates
app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

// home route
app.get("/", (req, res) => {
  res.render("home",{message: ""});
});

app.use('/auth', require('./routes/auth.routes'))
app.use('/user', require('./routes/user.routes'))
app.use('/post', require('./routes/post.routes'))
app.use('/', require('./routes/add.routes'))
app.use('/', require('./routes/api.routes'))
app.use('/', require('./routes/api.routes'))
app.use('/', require('./routes/search.routes'))

app.listen(process.env.PORT || 5000);
