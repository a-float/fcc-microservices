module.exports = function(app, filename) {
    const mongoose = require('mongoose')
    mongoose.connect()
    const baseUrl = '/' + filename
    app.get(baseUrl, (req, res) => {
        res.render(filename, { url: filename })
    })
}