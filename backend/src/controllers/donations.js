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
    
        const today = new Date(); // Hoy
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
    
        console.log('Hoy:', today);
        console.log('Hace 6 meses:', sixMonthsAgo);
    
        const filteredDonations = donations.filter(donation => {
            const donationDate = new Date(donation.Fecha); 
            return donationDate >= sixMonthsAgo;
        });
    
        return filteredDonations;
    }
}
  
module.exports = DonationController;