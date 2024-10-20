require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { Pool } = require('pg');
//adding comment to check if its working out
const app = express();

const port = process.env.PORT || 3000;

// Create a new pool instance to connect to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USERNAME, // replace with your PostgreSQL username
  host: process.env.DB_HOST,
  database: 'booksdb', // replace with your database name
  password: process.env.DB_PASSWORD, // replace with your PostgreSQL password
  port: process.env.DB_PORT,
});

// Middleware to parse JSON requests
app.use(express.json());

// Sample route to get data from PostgreSQL
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books'); // replace with your table name
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Your application routes go here...
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
