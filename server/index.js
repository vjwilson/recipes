import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import recipeModel from './models/recipeModel';
const Recipe = recipeModel();

import recipeRoutes from './routes/recipeRoutes';
const recipeRouter = recipeRoutes(Recipe);

app.use('/api/recipes', recipeRouter);

app.get('/', function(req, res) {
  res.send('Welcome to Recipes API');
});

export default app;
