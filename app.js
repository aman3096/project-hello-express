const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
const port = 3000;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Your application routes go here...
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
