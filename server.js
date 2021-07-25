// code from the https://github.com/freeCodeCamp/boilerplate-project-timestamp/ template

// init project
require('dotenv').config()
var fs = require('fs')
var express = require('express');
var morgan = require('morgan')
var bodyParser = require('body-parser')

var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));

app.use(morgan('tiny'))
app.set('views', './views')
app.set('view engine', 'pug')


// register the projects' routes
const names = fs.readdirSync(__dirname + '/projects')
    .filter(s => s[0] !== '_')
    .map(s => s.split('.').slice(0, -1).join('.'))

names.forEach(name => {
    console.log('Registering:', name)
    require('./projects/' + name)(app, name)
})

app.get('/', (req, res) => {
    res.render('index')
});

// listen for requests
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});