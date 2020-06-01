const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {Customers, validate} = require('../models/customers');

const customerRouter = express.Router();
customerRouter.use(bodyParser.json());

customerRouter.route('/')
.get(async (req,res) => {
    const customer = await Customers.find({}).sort('name');
    if (!customer) return res.status(404).send('The customer with the given details was not found.'); 

    res.statusCode = 200;
    res.send(customer);
})
.post(async (req,res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const obj = {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    };
    const customer = await Customers.create(obj);
    res.statusCode = 201;
    res.send(customer);
})
.put((req,res) => {
    res.status(400).send('PUT operation not supported on /api/customers');
})
.delete((req,res) => {
    res.status(400).send('DELETE operation not supported on /api/customers');
});

customerRouter.route('/:id')
.get(async (req,res) => {
    const customer = await Customers.find({_id: req.params.id}).sort('name');
    if(!customer) return res.status(404).send(`The customer with ${req.params.id} was not found.`);

    res.statusCode = 200;
    res.send(customer);
})
.post(async(req,res) => {
    res.status(400).send(`POST operation not supported on /api/customers/${req.params.id}`);
})
.put(async(req,res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const obj = {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    };
    const customer = await Customers.findByIdAndUpdate(req.params.id, obj, { new: true });
    if(!customer) return res.status(404).send(`The customer with ${req.params.id} was not found.`);

    res.statusCode = 200;
    res.send(customer); 
})
.delete(async(req,res) => {
    const customer = await Customers.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send(`The customer with ${req.params.id} was not found.`);

    res.statusCode = 200;
    res.send(customer);
});

  
module.exports = customerRouter;