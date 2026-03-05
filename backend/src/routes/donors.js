const express = require('express');
const DonorHttpHandler = require('../handlers/donors');
const DonorController = require('../controllers/donors');

module.exports = (dbService) => {
  const router = express.Router();
  const donorsController = new DonorController(dbService);
  const donorsHandler = new DonorHttpHandler(donorsController);
  router.post('/signup', donorsHandler.signup.bind(donorsHandler));
  router.post('/login', donorsHandler.login.bind(donorsHandler));
  return router;
};