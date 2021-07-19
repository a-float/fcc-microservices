module.exports = function(app, filename) {
    const mongoose = require('mongoose')
    const schemas = require('./_schemas')
    const baseUrl = '/' + filename
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Connected to the database')

            const User = mongoose.model('User', schemas.UserSchema)
            const Exercise = mongoose.model('Exercise', schemas.ExerciseSchema)

            app.get(baseUrl, async(req, res) => {
                // get all users with their exercises
                const users = await User.find().populate('exercises')
                res.render(filename, { url: filename, users })
            })
            app.get(baseUrl + '/api/users', async(req, res) => {
                // get id and username of all users
                const allUsers = await User.find().select('_id username')
                res.json(allUsers)
            })
            app.post(baseUrl + '/api/users', (req, res) => {
                // create and try to save the new user
                (new User({ username: req.body.username }))
                .save((err, newUser) => {
                    if (err) {
                        console.error(err)
                        res.json({ error: err.errors.username.message })
                    } else {
                        console.log("Added a new user: ", newUser)
                        res.json({
                            _id: newUser._id,
                            username: newUser.username
                        })
                    }
                })
            })
            const handleNoUserError = (res, err) => {
                const errMsg = `No user with specified id: "${req.body._id}"`
                console.log(errMsg + ' ' + err)
                res.json({ error: errMsg })
            }
            app.post(baseUrl + '/api/users/:_id/exercises', async(req, res) => {
                User.findById(req.params._id)
                    .then(user => {
                        if (!req.body.date) req.body.date = new Date()
                        req.body.owner = user._id
                        const newExercise = new Exercise(req.body)
                        newExercise.save((err, data) => {
                            if (err) {
                                console.log(err)
                                res.json({ error: 'Could not add the exercise' })
                            } else {
                                console.log('Created exercise: ' + data)
                                user.exercises.push(newExercise._id)
                                user.save().then(() => {
                                    res.json({
                                        _id: user._id,
                                        username: user.username,
                                        date: newExercise.date.toDateString(),
                                        description: newExercise.description,
                                        duration: newExercise.duration
                                    })
                                })
                            }
                        })
                    })
                    .catch(err => {
                        handleNoUserError(res, err)
                    })
            })
            app.get(baseUrl + '/api/users/:_id/logs', async(req, res) => {
                User.findById(req.params._id).populate('exercises')
                    .then(user => {
                        res.json({
                            _id: user._id,
                            username: user.username,
                            count: user.exercises.length,
                            logs: user.exercises.map(e => { return { date: e.date, duration: e.duration, description: e.description } })
                        })
                    })
                    .catch(err => {
                        handleNoUserError(res, err)
                    })
            })
        })
        .catch(err => {
            console.error("Database connection error:", err)
            app.get(baseUrl, async(req, res) => {
                res.send('Could not connect to the database')
                return
            })
        })
}