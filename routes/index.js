var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /sample:
 *   get:
 *     summary: Returns a sample message
 *     responses:
 *       200:
 *         description: A successful response
 */
router.get('/sample', function(req, res, next) {
  res.send("A successful response");
});

module.exports = router;
