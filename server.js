const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
// will now work with 'heroku' or the local environment
const port = process.env.PORT || 3000;

// create new express application
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  // node v7 and above requires the callback function in the following statement
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to derver.log.');
    }
  });
  next();
});

// // toggle comments to switch the website in and out of maintenance mode
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// add express middleware to allow a static folder
// express.static takes the absolute path of the folder we want to serve up
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('myUpperCase', (text) => {
  return text.toUpperCase();
});

console.log('       __dirname = ', __dirname);
console.log('static directory = ', __dirname + '/public');

// register and setup http route handlers
// (url, function to run)
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    pageHeading: 'Home Page',
    welcomeMessage: 'Welcome to my website',
  });
});

// populate page template dynamically
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    pageHeading: 'About Page',
  });
});

// app.get('/help', (req, res) => {
//   res.send('Help Page');
// });

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

// app.listen will bind the application to a port on our machine
// app.listen(3000);
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
