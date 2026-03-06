class DonationHttpHandler {
    constructor(donationController) {
      this.donationController = donationController;
    }
  
    async getOSCDonations(req, res) {
      try {
        const { rfc } = req.body;
        const donations = await this.donationController.getOSCDonations(rfc);
        res.json(donations);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

    async getOSCDonationsLastSixMonths(req, res) {
        try {
          const { rfc } = req.body;
          const donations = await this.donationController.getOSCDonationsLastSixMonths(rfc);
          res.json(donations);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }

    async submitFile(req, res) {
      try {
        const file = req.file;
        const fileUrl = await this.donationController.submitFile(file);
        res.json({ message: 'File received successfully', url: fileUrl });
      }
      catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

    async createDonation(req, res) {
      try {
        await this.donationController.createDonation(req.body);
        res.json({ message: 'Donation received successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }      

    }
  }
  
  // Export the class directly
  module.exports = DonationHttpHandler;
  