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

    async getDonorsByOSC(req, res) {
      try {
        console.log('=== Handler getDonorsByOSC ===');
        console.log('Body recibido:', req.body);
    
        const { rfc } = req.body;
    
        if (!rfc) {
          return res.status(400).json({ error: 'RFC es requerido' });
        }
    
        const donors = await this.donationController.getDonorsByOSC(rfc);
        console.log('Enviando donantes:', donors.length);
    
        res.json(donors);
      } catch (error) {
        console.error('Error en handler getDonorsByOSC:', error);
        res.status(500).json({ error: error.message });
      }
    }
  }
  
  // Export the class directly
  module.exports = DonationHttpHandler;
  