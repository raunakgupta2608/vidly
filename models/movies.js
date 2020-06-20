const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const Schema = mongoose.Schema;
const {genresSchema} = require('../models/genres');

const movieSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim:true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genresSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

function validateMovies(movie) {
    const schema = {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(1).max(5).required(),
        dailyRentalRate: Joi.number().min(1).max(5).required()
    };

    return Joi.validate(movie, schema);
}

var Movies = mongoose.model('Movie', movieSchema);

module.exports.Movies = Movies;
module.exports.validate = validateMovies;
