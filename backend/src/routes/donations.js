const express = require('express');
const DonationHttpHandler = require('../handlers/donations');
const DonationController = require('../controllers/donations');
const multer = require('multer');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = (dbService, s3Service) => {
  const router = express.Router();
  const donationController = new DonationController(dbService, s3Service);
  const donationHandler = new DonationHttpHandler(donationController);

  router.post('/', donationHandler.createDonation.bind(donationHandler));
  router.get('/osc', donationHandler.getOSCDonations.bind(donationHandler));
  router.get('/osc/last-six-months', donationHandler.getOSCDonationsLastSixMonths.bind(donationHandler));
  router.post('/submit-file', upload.single('file'), donationHandler.submitFile.bind(donationHandler));
  return router;
};