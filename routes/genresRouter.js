const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Genres = require('../models/genres');

const genresRouter = express.Router();
genresRouter.use(bodyParser.json());

genresRouter.route('/')
.get((req, res) => {
  Genres.find({})
  .then((genres) => {
    res.statusCode = 200;
    res.send(genres);
  }, (err) => console.log(err))
  .catch((err) => console.log(err));
})
.post((req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  Genres.create(req.body)
  .then((genres) => {
    res.statusCode = 200;
    res.send(genres);
  }, (err) => console.log(err))
  .catch((err) => console.log(err));
})
.put((req,res) => {
  res.status(400).send('PUT operation not supported on /api/genres');
})
.delete((req,res) => {
  res.status(400).send('DELETE operation not supportedon /api/genres');
})



genresRouter.route('/:id')
.get((req, res) => { console.log(req.params.id);

  Genres.findById(req.params.id)
  .then((genres) => { console.log(genres);
    if(!genres) return res.status(404).send('The genre with the given ID was not found.');

    res.statusCode = 200;
    res.send(genres);
  }, (err) => console.log(err))
  .catch((err) => console.log(err));
})
.post((req,res) => {
  res.status(400).send('POST operation not supported on /api/genres/:id');
})
.put((req, res) => {
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  Genres.findByIdAndUpdate(req.params.id , { name: req.body.name }, { new: true })
  .then((genres) => {
    if(!genres) return res.status(404).send('The genre with the given ID was not found.');

    res.statusCode = 200;
    res.send(genres);
  }, (err) => console.log(err))
  .catch((err) => console.log(err));
})
.delete((req, res) => {
  Genres.findByIdAndRemove(req.params.id)
  .then((genres) => {
    if(!genres) return res.status(404).send('The genre with the given ID was not found.');

    res.statusCode = 200;
    res.send(genres);
  }, (err) => console.log(err))
  .catch((err) => console.log(err));
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = genresRouter;