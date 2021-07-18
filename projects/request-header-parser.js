module.exports = function(app, filename) {
    const baseUrl = '/' + filename
    app.get(baseUrl, (req, res) => {
        res.render(filename, { url: baseUrl });
    })
    app.get(baseUrl + '/api/whoami', (req, res) => {
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