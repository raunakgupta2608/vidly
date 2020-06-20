const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {Movies, validate} = require('../models/movies');
const {Genres} = require('../models/genres');

const moviesRouter = express.Router();
moviesRouter.use(bodyParser.json());

moviesRouter.route('/')
.get(async (req,res) => {
    const movies = await Movies.find({}).sort('name');
    if (!movies) return res.status(404).send('No Movie found.'); 

    res.statusCode = 200;
    res.send(movies);
})
.post(async (req,res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genres.findById(req.body.genreId);
    if(!genre) return res.status(404).send('Invalid Genre');

    const movie = new Movies({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });
    await movie.save();
    res.statusCode = 201;
    res.send(movie);
})
.put(async (req,res) => {
    res.status(400).send('PUT operation not supported on /api/movies');
})
.delete(async (req,res) => {
    res.status(400).send('DELETE operation on supported by /api/movies');
});

moviesRouter.route('/:id')
.get(async (req,res) => {
    const movie = await Movies.find({_id: req.params.id}).sort('name');
    if(!movie) return res.status(404).send(`The movie with ${req.params.id} was not found.`);

    res.statusCode = 200;
    res.send(movie);
})
.post(async (req,res) => {
    res.status(400).send('POST operation on supported by /api/movies/:id');
})
.put(async (req,res) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = Genres.findById(req.body.genreId);
    if(!genre) return res.status(400).send('Invalid Genre.');

    const movie = await Movies.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });

    if(!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.statusCode = 200;
    res.send(movie);
})
.delete(async (req,res) => {
    const movie = await Movies.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(400).send('The movie with the given ID was not found.');

    res.status = 200;
    res.send(movie);
});

module.exports = moviesRouter;
