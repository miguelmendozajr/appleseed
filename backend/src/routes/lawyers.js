const express = require('express');
const LawyerHttpHandler = require('../handlers/lawyers');
const LawyerController = require('../controllers/lawyers');

module.exports = (dbService) => {
  const router = express.Router();
  const lawyerController = new LawyerController(dbService);
  const lawyerHandler = new LawyerHttpHandler(lawyerController);
  router.get('/', lawyerHandler.getAllLawyers.bind(lawyerHandler));
  return router;
};