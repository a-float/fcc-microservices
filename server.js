// code from the https://github.com/freeCodeCamp/boilerplate-project-timestamp/ template

// init project
require('dotenv').config()
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

app.get("/", function(req, res) {
    res.render("index");
});

// register the projects' routes
require('./projects/timestamp')(app);
require('./projects/request_header_parser')(app);
require('./projects/url_shortener')(app);

// your first API endpoint... 
app.get("/api/hello", function(req, res) {
    res.json({ greeting: 'hello API' });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});

/*
// handle 404 error
app.use(function(req, res, next) {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
    }

    // respond with json
    if (req.accepts('json')) {
        res.json({ error: 'Not found' });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
});
*/