const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');


const connect = mongoose.connect(config.mongoUrl);
connect.then((db) => console.log(`Connected to ${db}`))
       .catch((err) => console.log(err));

const genresRoute = require('./routes/genresRouter');

const genres = require('./models/genres');

const app = express(); 
app.use(express.json());
app.use('/api/genres', genresRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));