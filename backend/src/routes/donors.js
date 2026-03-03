const express = require('express');
const DonorsHandler = require('../handlers/donors');
const DonorsController = require('../controllers/donors');

module.exports = (dbService) => {
  const router = express.Router();
  const donorsController = new DonorsController(dbService);
  const donorsHandler = new DonorsHandler(donorsController);
  router.post('/login', donorsHandler.login.bind(donorsHandler));
  return router;
};