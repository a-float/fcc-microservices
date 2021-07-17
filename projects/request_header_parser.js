module.exports = function(app) {
    app.get('/requestheaderparser', (req, res) => {
        res.render('request_header_parser', { url: req.url });
    })
    app.get('/requestheaderparser/api/whoami', (req, res) => {
        console.log(req.headers)
        res.json({
            ipaddres: req.ip,
            language: req.headers['accept-language'],
            software: req.headers['user-agent']
        })
    })
}