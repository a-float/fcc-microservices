module.exports = function(app) {
    const URL = require("url").URL;
    const urlArray = []
    const maxArrayLength = 30
    let currentArrayIndex = 0
    const stringIsAValidUrl = (s) => {
        try {
            new URL(s);
            return true;
        } catch (err) {
            return false;
        }
    };

    app.get('/urlshortener', (req, res) => {
        res.render('url_shortener', { url: req.url });
    })
    app.get('/urlshortener/api/shorturl/:shorturl', (req, res) => {
        console.log(req.params)
        let shorturl
        try {
            shorturl = parseInt(req.params.shorturl)
        } catch (e) {
            console.error(e)
            res.json({ error: 'invalid short url' })
        }
        if (urlArray[shorturl] !== undefined) {
            res.redirect(urlArray[shorturl]);
        } else {
            res.json({ error: 'invalid short url' })
        }
    })
    app.post('/urlshortener/api/shorturl', (req, res) => {
        console.log('Shortening "' + req.body.url + '"')
        const urlToShorten = req.body.url
        if (stringIsAValidUrl(urlToShorten)) {
            const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            urlArray[currentArrayIndex++] = urlToShorten
            res.json({
                original_url: urlToShorten,
                short_url: fullUrl + '/' + (currentArrayIndex - 1).toString()
            })
            if (currentArrayIndex == maxArrayLength) currentArrayIndex = 0;
        } else {
            res.json({
                error: 'invalid url'
            })
        }
    })
}