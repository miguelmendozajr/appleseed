require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DBService = require('./src/db/service');
const S3Service = require('./src/db/s3Service');
const lawyersRoutes = require('./src/routes/lawyers');
const oscRoutes = require('./src/routes/osc');
const donorsRoutes = require('./src/routes/donors');
const donationsRoutes = require('./src/routes/donations');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const dbService = new DBService();
const s3Service = new S3Service();

async function initializeServices() {
  try {
    await dbService.initialize();
    await s3Service.initialize();
    console.log('Database connected');
    console.log('S3 service initialized');
    return { dbService, s3Service };
  } catch (err) {
    console.error('Failed to initialize services:', err);
    process.exit(1);
  }
}

initializeServices()
  .then(({ dbService, s3Service }) => {
    console.log('All services initialized successfully');

    app.use('/api/lawyers', lawyersRoutes(dbService));
    app.use('/api/osc', oscRoutes(dbService));
    app.use('/api/donors', donorsRoutes(dbService));
    app.use('/api/donations', donationsRoutes(dbService, s3Service));

    const PORT = process.env.PORT || 3005;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to initialize services:', err);
    process.exit(1);
  });