const express = require('express');
const OSCHttpHandler = require('../handlers/osc');
const OSCController = require('../controllers/osc');

module.exports = (dbService) => {
  const router = express.Router();
  const oscController = new OSCController(dbService);
  const oscHandler = new OSCHttpHandler(oscController);
  
  router.get('/', oscHandler.getAll.bind(oscHandler));
  router.post('/login', oscHandler.login.bind(oscHandler));
  router.post('/signup', oscHandler.signup.bind(oscHandler));
  router.get('/:rfc/donors', oscHandler.getOSCDonors.bind(oscHandler));
  
  return router;
};
