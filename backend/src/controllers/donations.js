class DonationController {
    constructor(service, s3Service) {
      this.service = service;
      this.s3Service = s3Service;
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

    async submitFile(file) {
        const result = await this.s3Service.uploadFile(file);
        return result;
    }

    async createDonation(donationData) {
        
    }
    
}
  
module.exports = DonationController;