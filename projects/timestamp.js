module.exports = function(app, filename) {
    const baseUrl = '/' + filename
    app.get(baseUrl, (req, res) => {
        res.render(filename, { url: baseUrl });
    })
    app.get(baseUrl + '/api/:date?', (req, res) => {
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