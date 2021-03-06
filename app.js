// Requiring essential packages
const express               = require('express'),
      app                   = express(),
      adminRoutes           = require('./routes/admin'),
      bodyParser            = require('body-parser'),
      mongoose              = require('mongoose'),
      passport              = require('passport'),
      localStratergy        = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      userFns               = require('./functions/functions'),
      userSchema            = require('./models/user'),
      dashboardRoutes       = require('./routes/dashboard'),
      stdRoutes             = require('./routes/students'),
      userRoutes            = require('./routes/userview'),
      respondRoutes         = require('./routes/respond')

// Connecting Database
mongoose.connect('mongodb://localhost/insight', {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

// setting view engine
app.set('view engine', 'ejs')
// setting public folder as accessible to anyone
app.use(express.static('public'))
// setting bodyParser for taking data from request body in POST requests
app.use(bodyParser.urlencoded({extended: true}))
// setting up session management
app.use(require('express-session')({
  secret: 'Ruby is the best language to code',
  resave: false,
  saveUninitialized: false
}))
// setting up passport
app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStratergy(userSchema.authenticate()))
passport.serializeUser(userSchema.serializeUser())
passport.deserializeUser(userSchema.deserializeUser())

app.get('/', userFns.isNotLoggedIn, (req, res) => {
  res.redirect('/user/login')
})

// Setting up routes
app.use('/', adminRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/student', stdRoutes)
app.use('/user', userRoutes)
app.use('/respond', respondRoutes)

// Activating server
const port = process.env.PORT || 3000
app.listen(port, userFns.startServer(port))
