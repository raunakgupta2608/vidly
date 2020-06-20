const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const genresSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

var Genres = mongoose.model('Genre', genresSchema);

function validateGenres(genre) {
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(genre, schema);
}

module.exports.genresSchema = genresSchema;
module.exports.Genres = Genres;
module.exports.validate = validateGenres;