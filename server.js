const path = require('path');
require('dotenv').config();
const config = require('./config')
const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

// BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
); // session secret

app.use(passport.initialize());
app.use(passport.session());

// Handlebars
const viewsPath = path.join(__dirname, 'views');
const layoutsPath = path.join(viewsPath, 'layouts');
const partialsPath = path.join(viewsPath, 'partials');
app.set('views', viewsPath);

const exphbsConfig = exphbs.create({
  defaultLayout: 'main',
  layoutsDir: layoutsPath,
  partialsDir: [partialsPath],
  extname: '.hbs'
});

app.engine('hbs', exphbsConfig.engine);
app.set('view engine', '.hbs');

// Models
const models = require('./models');
// const { config } = require('dotenv');

// Express static assets
app.use(express.static("public"));

// Routes
const authRoute = require('./controllers/auth.js')(app, passport);

// Load passport strategies
require('./config/passport/passport.js')(passport, models.user);

// Sync Database
models.sequelize
  .sync()
  .then(function () {
    console.log('Database Connected %s:%s', config.host, config.port);

    const server_host = process.env.SERVER_HOST || '127.0.0.1'
    const server_port = process.env.SERVER_PORT || 3000
    app.listen(server_port, server_host, function (err) {
      if (!err) console.log(`Connected at http://${server_host}:${server_port}`);
      else console.log(err);
    });
  })
  .catch(function (err) {
    console.log(err, 'Error on Database Sync. Please try again!');
  });
