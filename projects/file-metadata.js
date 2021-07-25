module.exports = function(app, filename) {
    var multer = require('multer')
    var upload = multer({ dest: 'uploads/' })
    var fs = require('fs')
    var path = require('path')

    const clearUploadsDir = () => {
        const directory = 'uploads'
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                console.log(file)
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    }


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
        clearUploadsDir()
        console.log(data)
        res.json(data)
    })
}