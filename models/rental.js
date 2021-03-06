const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
    customer: {
        required: true,
        type: new Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        })
    },
    movie: {
        required: true,
        type: new Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate : {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        })
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

function validateRental(rental) {
    const schema = {
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
    };
  
    return Joi.validate(rental, schema);
  }

var Rental = mongoose.model('Rental', rentalSchema);

module.exports.Rental = Rental;
module.exports.validate = validateRental;