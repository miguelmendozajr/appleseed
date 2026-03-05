class DonationHttpHandler {
    constructor(donationController) {
      this.donationController = donationController;
    }
  
    async getOSCDonations(req, res) {
      try {
        const { rfc } = req.query;
        const donations = await this.donationController.getOSCDonations(rfc);
        res.json(donations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

    async getOSCDonationsLastSixMonths(req, res) {
        try {
          const { rfc } = req.query;
          const donations = await this.donationController.getOSCDonationsLastSixMonths(rfc);
          res.json(donations);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }
  }
  
  // Export the class directly
  module.exports = DonationHttpHandler;
  