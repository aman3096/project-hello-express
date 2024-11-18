const express = require('express');
const { v4: uuidv4 } = require('uuid');
var router = express.Router();
const { Pool } = require('pg');

const authenticate = require('../middlewares/authenticate');

const pool = new Pool({
    user: process.env.DB_USERNAME, 
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

router.get('/', authenticate, function(req, res, next) {
    try {
        res.send('budget allocation in progress');
    } catch(err) {
        res.send('Server Error Occurred')
    }
  });
  
  module.exports = router;
  