module.exports = function(app) {
    app.get('/timestamp', (req, res) => {
        res.render('timestamp', { url: req.url });
    })
    app.get('/timestamp/api/:date?', (req, res) => {
        if (req.params.date === undefined) {
            const now = new Date()
            res.json({
                unix: Date.parse(now.toString()),
                utc: now.toUTCString()
            })
        }
        if (!isNaN(req.params.date)) req.params.date = parseInt(req.params.date)
        const date = new Date(req.params.date)
        res.json({
            unix: Date.parse(date),
            uts: date.toUTCString()
        })
    })
}