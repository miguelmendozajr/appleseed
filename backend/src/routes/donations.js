const express = require('express');
const DonationHttpHandler = require('../handlers/donations');
const DonationController = require('../controllers/donations');

module.exports = (dbService) => {
  const router = express.Router();
  const donationController = new DonationController(dbService);
  const donationHandler = new DonationHttpHandler(donationController);
  
  
  router.get('/osc', donationHandler.getOSCDonations.bind(donationHandler));
  router.post('/osc/last-six-months', donationHandler.getOSCDonationsLastSixMonths.bind(donationHandler));
  
 
  router.post('/osc/donors', donationHandler.getDonorsByOSC.bind(donationHandler));
  
  return router;
};