import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const postgresConnectionOptions = {
  user: process.env.RECIPE_DATABASE_USER,
  host: process.env.RECIPE_DATABASE_SERVER,
  database: process.env.RECIPE_DATABASE_DATABASE,
  max: 10,
  idleTimeoutMillis: 30000
};

if (process.env.NODE_ENV === 'production') {
  postgresConnectionOptions.password = process.env.RECIPE_DATABASE_PASSWORD;
}

const pool = new Pool(postgresConnectionOptions);

import recipeModel from './models/recipeModel';
const Recipe = recipeModel(pool);

import recipeRoutes from './routes/recipeRoutes';
const recipeRouter = recipeRoutes(Recipe);

app.use('/api/recipes', recipeRouter);

app.get('/', function(req, res) {
  res.send('Welcome to Recipes API');
});

app.listen(port, function () {
  console.log('Server running on port %d', port); // eslint-disable-line no-console
});
