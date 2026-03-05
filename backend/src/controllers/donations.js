class DonationController {
    constructor(service) {
      this.service = service;
    }
    async getOSCDonations(rfc) {
        const donations = await this.service.getOSCDonations(rfc);
        return donations;
    }

    async getOSCDonationsLastSixMonths(rfc) {
        const donations = await this.service.getOSCDonations(rfc);
        // TODO: Filter donations from the last 6 months

        return donations;
    }
}
  
module.exports = DonationController;