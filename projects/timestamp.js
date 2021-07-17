module.exports = function(app) {
    app.get('/timestamp', (req, res) => {
        res.render('timestamp', { url: req.url });
    })
    app.get('/timestamp/api/:date?', (req, res) => {
        const timestamp = Date.parse(req.params.date)
        if (isNaN(timestamp)) {
            res.json({ error: 'Invalid Date' })
        } else {
            res.json({
                unix: timestamp,
                utc: (new Date(timestamp)).toUTCString()
            })
        }
    })
}