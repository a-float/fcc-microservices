module.exports = function(app, filename) {
    const mongoose = require('mongoose')
    const Schema = mongoose.Schema
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(console.log('Connected to the database'))
        .catch(console.error.bind(console, 'connection error:'))

    const ExerciseSchema = new Schema({
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    })

    const UserSchema = new Schema({
        username: {
            type: String,
            required: true,
            unique: true
        },
        exercises: [{
            type: Schema.Types.ObjectId,
            ref: "Exercise"
        }]
    })
    const User = mongoose.model('User', UserSchema)
    const Exercise = mongoose.model('Exercise', ExerciseSchema)

    const getAllUsers = async() => { return User.find().populate('exercises') }

    const baseUrl = '/' + filename
    app.get(baseUrl, async(req, res) => {
        const users = await getAllUsers()
        res.render(filename, { url: filename, users })
    })
    app.get(baseUrl + '/api/users', async(req, res) => {
        const allUsers = await User.find().select('_id username').exec()
        res.json(allUsers)
    })
    app.post(baseUrl + '/api/users', (req, res) => {
        const username = req.body.username;
        if (!username) {
            const info = { error: 'No username specified' }
            console.error(info)
            res.json(info)
        } else {
            const newUser = new User({ username: username })
            newUser.save((err, data) => {
                if (err) {
                    if (err.code === 11000) {
                        res.json({ error: 'The username is taken' })
                    } else {
                        res.json({ error: 'Could not add the user' })
                    }
                } else {
                    console.log('Created user: ' + data)
                    res.json({
                        _id: data._id,
                        username: data.username
                    })
                }
            })
        }
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
                        console.error(err)
                        res.json({ error: 'Could not add the exercise' })
                    } else {
                        console.log('Created exercise: ' + data)
                        user.exercises.push(newExercise._id)
                        user.save().then(() => {
                            res.json({
                                _id: user._id,
                                username: user.username,
                                date: newExercise.date,
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
}