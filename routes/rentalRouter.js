const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {Rental, validate} = require('../models/rental');
const {Movies} = require('../models/movies'); 
const {Customers} = require('../models/customers');

const Fawn = require('fawn');
Fawn.init(mongoose);

const rentalRouter = express.Router();
rentalRouter.use(bodyParser.json());
 
rentalRouter.route('/')
.get(async (req,res) => {
    const rental = await Rental.find({}).sort('-dateOut');
    if (!rental) return res.status(404).send('No Information Available.'); 

    res.statusCode = 200;
    res.send(rental);
})
.post(async (req,res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customers.findById(req.body.customerId);
    if(!customer) return res.statusCode(404).send('No customer found');

    const movie = await Movies.findById(req.body.movieId);
    if(!movie) return res.statusCode(404).send('No Movie found');

    if(movie.numberInStock === 0) return res.statusCode(400).send('Movie not in stock.');
    
    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try{
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id}, {
            $inc: { numberInStock: -1 }
        })
        .run();

        res.send(rental);   
    }
    catch(ex) {
        res.status(500).send('Something went wrong.');
    }
})
.put(async (req,res) => {
    res.status(400).send('PUT operation on supported by /api/rental');
})
.delete(async (req,res) => {
    res.status(400).send('DELETE operation on supported by /api/rental');
});

rentalRouter.route('/:id')
.get(async (req,res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.statusCode = 200;
    res.send(rental);
})
.post(async (req,res) => {
    res.status(400).send('POST operation on supported by /api/rental/:id');
})
.put(async (req,res) => {
    res.status(400).send('PUT operation on supported by /api/rental/:id');
})
.delete(async (req,res) => {
    res.status(400).send('DELETE operation on supported by /api/rental/:id');
});

module.exports = rentalRouter;