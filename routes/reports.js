const express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');

const authenticate = require('../middlewares/authenticate');

const pool = new Pool({
  user: process.env.DB_USERNAME, 
  host: process.env.DB_HOST,
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
// summary reports 
  router.get('/summary', authenticate, async (req, res, next) => {
    try {
      const userId = req.user.id; // Extracted from the authentication middleware
      const { startDate, endDate } = req.query;
  
      // Default date range (e.g., current month)
      const start = startDate || new Date(new Date().setDate(1)).toISOString().slice(0, 10);
      const end = endDate || new Date().toISOString().slice(0, 10);
  
      // Fetch total income and expenses
      const transactionsSummary = await pool.query(
        `
        SELECT 
          SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
          SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses
        FROM transactions
        WHERE account_id IN (
          SELECT id FROM accounts WHERE user_id = $1
        ) AND date BETWEEN $2 AND $3
        `,
        [userId, start, end]
      );
  
      const { total_income, total_expenses } = transactionsSummary.rows[0];
  
      // Fetch budgets and calculate spent amounts
      const budgets = await pool.query(
        `
        SELECT 
          b.category,
          b.limit_amount,
          COALESCE(SUM(t.amount), 0) AS spent
        FROM budgets b
        LEFT JOIN transactions t ON t.category = b.category
        WHERE b.user_id = $1 AND t.date BETWEEN $2 AND $3
        GROUP BY b.category, b.limit_amount
        `,
        [userId, start, end]
      );
  
      // Format the response
      const budgetSummary = budgets.rows.map(budget => ({
        category: budget.category,
        limit: parseFloat(budget.limit_amount),
        spent: parseFloat(budget.spent),
        remaining: parseFloat(budget.limit_amount) - parseFloat(budget.spent),
      }));
  
      // Response object
      const response = {
        period: { start, end },
        totalIncome: parseFloat(total_income) || 0,
        totalExpenses: parseFloat(total_expenses) || 0,
        budgetSummary,
      };
  
      res.status(200).json(response);
  
    } catch (error) {
        console.error('Error fetching report summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  module.exports = router;
  