import express from 'express';
import bodyParser from 'body-parser';
var cors = require('cors');
import { Pool } from 'pg';
import passport from 'passport';
import morgan from 'morgan';
import compression from 'compression';

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());

// Log requests to console
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// gzip responses for better performance
app.use(compression());

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

app.use(passport.initialize());

import userModel from './models/userModel';
const User = userModel(pool);

import passportConfig from './config/passport';
passportConfig(passport, User);

import authRoutes from './routes/authRoutes';
const authRouter = authRoutes(User);

import recipeModel from './models/recipeModel';
const Recipe = recipeModel(pool);

import recipeRoutes from './routes/recipeRoutes';
const recipeRouter = recipeRoutes(Recipe);

import categoryModel from './models/categoryModel';
const Category = categoryModel(pool);

import categoryRoutes from './routes/categoryRoutes';
const categoryRouter = categoryRoutes(Category);

app.use('/api/recipes', recipeRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/auth', authRouter);

app.get('/', function(req, res) {
  res.send('Welcome to Recipes API');
});

app.listen(port, function () {
  console.log('Server running on port %d', port); // eslint-disable-line no-console
});

export default app;
