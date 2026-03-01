require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DBService = require('./src/db/service');
const lawyersRoutes = require('./src/routes/lawyers');
const oscRoutes = require('./src/routes/osc');

const app = express();
app.use(cors());
app.use(express.json());

const dbService = new DBService();

dbService.initialize()
  .then(() => {
    console.log('Database connected');

    app.use('/api/lawyers', lawyersRoutes(dbService));
    app.use('/api/auth', oscRoutes(dbService));

    const PORT = process.env.PORT || 3005;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });