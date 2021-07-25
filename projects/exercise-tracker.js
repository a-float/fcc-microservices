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
                console.log(users)
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
            const handleError = (res, err) => {
                console.log(err)
                const errMsg = `No user with specified id: "${req.body._id}"`
                console.log(errMsg + ' ' + err)
                res.json({ error: errMsg })
            }
            app.post(baseUrl + '/api/users/:_id/exercises', async(req, res) => {
                User.findById(req.params._id)
                    .then(user => {
                        if (!req.body.date) req.body.date = new Date()
                        req.body.owner = user._id;
                        Exercise.create(req.body, (err, newExercise) => {
                            if (err) {
                                console.log(err)
                                res.json({ error: 'Could not add the exercise' })
                            } else {
                                console.log('Created exercise: ' + newExercise)
                                user.exercises.push(newExercise._id)
                                user.save(err => {
                                    if (err) { handleError(err) } else {
                                        res.json({
                                            _id: user._id,
                                            username: user.username,
                                            date: newExercise.date.toDateString(),
                                            description: newExercise.description,
                                            duration: newExercise.duration
                                        })
                                    }
                                })
                            }
                        })
                    })
                    .catch(err => {
                        handleError(res, err)
                    })
            })
            app.get(baseUrl + '/api/users/:_id/logs', async(req, res) => {
                console.log(req.query)
                const dateFilters = { from: false, to: false }
                let query = Exercise
                    .find({ owner: req.params._id })
                    .select('description duration date')
                if ('from' in req.query && !isNaN(Date.parse(req.query.from))) {
                    dateFilters.from = true
                    query = query.where('date').gt(req.query.from)
                }
                if ('to' in req.query && !isNaN(Date.parse(req.query.to))) {
                    dateFilters.to = true
                    query = query.where('date').lt(req.query.to)
                }
                if ('limit' in req.query && !isNaN(req.query.limit.replace(' ', ''))) {
                    query = query.limit(parseInt(req.query.limit))
                }
                const exercises = await query.exec()
                const user = await User.findById(req.params._id)
                console.log(exercises.map(e => e.description), 'for user', user.username)
                const result = {
                    _id: user._id,
                    username: user.username,
                    ...(dateFilters.from && { from: new Date(req.query.from).toDateString() }),
                    ...(dateFilters.to && { to: new Date(req.query.to).toDateString() }),
                    count: exercises.length,
                    log: exercises.map(e => {
                        return {
                            description: e.description,
                            duration: e.duration,
                            date: e.date
                        }
                    })
                }
                res.json(result)
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