const uniqueValidator = require('mongoose-unique-validator');
const Schema = require('mongoose').Schema
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
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
UserSchema.plugin(uniqueValidator, { message: "Expected {PATH} to be unique. Value:{VALUE}" });

module.exports = {
    UserSchema,
    ExerciseSchema
}