module.exports = function(app, filename) {
    var multer = require('multer')
    var upload = multer({ dest: 'uploads/' })

    const baseUrl = '/' + filename
    app.get(baseUrl, (req, res) => {
        res.render(filename, { url: baseUrl });
    })
    app.post(baseUrl + '/api/fileanalyse', upload.single('upfile'), (req, res) => {
        const data = {
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size
        }
        console.log(data)
        res.json(data)
    })
}