const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const connect = mongoose.connect(config.mongoUrl);
connect.then((db) => console.log(`Connected to ${db}`))
       .catch((err) => console.log(err));

const genresRoute = require('./routes/genresRouter');
const customerRoute = require('./routes/customerRouter');
const moviesRouter = require('./routes/moviesRouter');
const rentalRouter = require('./routes/rentalRouter');

const genres = require('./models/genres');
const customer = require('./models/customers');
const movies = require('./models/movies');
const rental = require('./models/rental');

const app = express(); 
app.use(express.json());

app.use('/api/genres', genresRoute);
app.use('/api/customers', customerRoute);
app.use('/api/movies', moviesRouter);
app.use('/api/rental', rentalRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));