var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Recipe = require('../models/recipeModel')();

var recipeRouter = require('../routes/recipeRoutes')(Recipe);

app.use('/api/recipes', recipeRouter);

app.get('/', function(req, res) {
  res.send('Welcome to Recipes API');
});

module.exports = app;
