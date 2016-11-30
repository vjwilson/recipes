import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pool = new Pool({
  user: 'vwilson',
  host: 'localhost',
  database: 'recipes',
  max: 10, // max number of clients in pool
  idleTimeoutMillis: 30000, // close & remove clients which have been idle > 1 second
});

import recipeModel from './models/recipeModel';
const Recipe = recipeModel(pool);

import recipeRoutes from './routes/recipeRoutes';
const recipeRouter = recipeRoutes(Recipe);

app.use('/api/recipes', recipeRouter);

app.get('/', function(req, res) {
  res.send('Welcome to Recipes API');
});

export default app;
