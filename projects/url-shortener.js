module.exports = function(app, filename) {
    const baseUrl = '/' + filename
        // storing urls in a small array with consecutive ids. Not ideal but good enough
    const urlArray = []
    const maxArrayLength = 30
    let currentArrayIndex = 0

    const isURL = (str) => {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return pattern.test(str);
    }

    app.get(baseUrl, (req, res) => {
        res.render(filename, { url: baseUrl });
    })
    app.get(baseUrl + '/api/shorturl/:shorturl', (req, res) => {
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
    app.post(baseUrl + '/api/shorturl', (req, res) => {
        console.log('Shortening "' + req.body.url + '"')
        const urlToShorten = req.body.url
        if (isURL(urlToShorten)) {
            const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            urlArray[currentArrayIndex++] = urlToShorten
            const data = {
                original_url: urlToShorten,
                short_url: (currentArrayIndex - 1).toString(),
                full_short_url: fullUrl + '/' + (currentArrayIndex - 1).toString()
            }
            console.log('Has been shortened to: ', data.short_url)
            res.json(data)
            if (currentArrayIndex == maxArrayLength) currentArrayIndex = 0;
        } else {
            res.json({
                error: 'invalid url'
            })
        }
    })
}