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
const names = fs.readdirSync(__dirname + '/projects').map(s => s.split('.').slice(0, -1).join('.'))
for (const name of names) {
    require('./projects/' + name)(app, name)
}
app.get('/', (req, res) => {
    res.render('index')
});
// // setup the table of contents
// const hyphenToSnakeCase = str => str.replace(/-[a-zA-Z]/g, letter => ` ${letter.toUpperCase()}`)
// app.get("/", function(req, res) {
//     res.render("index", {
//         links: names.map(name => {
//             return {
//                 addr: name,
//                 name: hyphenToSnakeCase(name)
//             }
//         })
//     });
// });

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