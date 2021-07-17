module.exports = function(app) {
    app.get('/timestamp', (req, res) => {
        res.render('timestamp', { url: req.url });
    })
    app.get('/timestamp/api/:date?', (req, res) => {
        console.log('Parsing date: ' + req.params.date)
        let date;
        if (req.params.date === undefined) { // the current time
            date = new Date()
        } else if (!isNaN(req.params.date)) { // timestamp date
            date = new Date(parseInt(req.params.date))
        } else {
            date = new Date(req.params.date) // a string date
        }
        if (isNaN(date)) { // parsing unsuccesfull
            res.json({
                error: 'Invalid Date'
            })
        } else {
            const data = {
                unix: Date.parse(date),
                utc: date.toUTCString()
            }
            console.log('Response is: ', data)
            res.json(data)
        }
    })
}