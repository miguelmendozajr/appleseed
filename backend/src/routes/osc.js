const express = require('express');
const OSCHttpHandler = require('../handlers/osc');
const OSCController = require('../controllers/osc');

module.exports = (dbService) => {
  const router = express.Router();
  const oscController = new OSCController(dbService);
  const oscHandler = new OSCHttpHandler(oscController);
  
  router.get('/', oscHandler.getAll.bind(oscHandler));
  router.post('/login', oscHandler.login.bind(oscHandler));
  
  return router;
};
