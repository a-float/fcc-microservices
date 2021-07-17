module.exports = function(app) {
    app.get('/requestheaderparser', (req, res) => {
        res.render('request_header_parser', { url: req.url });
    })
    app.get('/requestheaderparser/api/whoami', (req, res) => {
        const info = {
            ipaddress: req.ip,
            language: req.headers['accept-language'],
            software: req.headers['user-agent']
        }
        console.log({
            headers: req.headers,
            info: info
        })
        res.json(info)
    })
}