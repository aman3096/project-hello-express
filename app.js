require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { Pool } = require('pg');

const swaggerSpec = require('./swagger');
const router = require('./routes');
const app = express();

const port = process.env.PORT || 3000;

// Create a new pool instance to connect to PostgreSQL
export const pool = new Pool({
  user: process.env.DB_USERNAME, // replace with your PostgreSQL username
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, // replace with your database name
  password: process.env.DB_PASSWORD, // replace with your PostgreSQL password
  port: process.env.DB_PORT,
});

// Middleware to parse JSON requests
app.use(express.json());
app.use('/api', router);
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
/*
Middleware: Implement authentication middleware to protect routes requiring authentication (e.g., income, expenses, budgets, and savings goals).
Validation: Use libraries like Joi or express-validator to validate incoming request data.
Error Handling: Ensure proper error handling and responses for different scenarios (e.g., not found, unauthorized).
This structure provides a comprehensive API for a personal finance management application, facilitating CRUD operations along with user authentication and authorization.
*/

app.listen(port, () => {
  console.log(`Server is running on port ${port} here`);
});
