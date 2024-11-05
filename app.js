require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { Pool } = require('pg');
const authenticate = require('./middlewares/authenticate');

const swaggerSpec = require('./swagger');
const router = require('./routes');
const accountRouter = require('./routes/account');
const app = express();

const port = process.env.PORT || 3000;

// Create a new pool instance to connect to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USERNAME, 
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(express.json());
app.use('/api', router);
app.use('/api/accounts', accountRouter);
// Sample route to get data from PostgreSQL
app.get('/api/data', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books'); // replace with your table name
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server is running on port ${port} here`);
});

module.exports = {
  pool: pool
}