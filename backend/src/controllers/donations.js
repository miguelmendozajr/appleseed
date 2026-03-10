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

    async getDonorsByOSC(rfc) {
        try {
            console.log('Buscando donantes para RFC:', rfc);
    
    // Obtener todas las donaciones de esta OSC
            const donations = await this.getOSCDonations(rfc);
            console.log('Donaciones encontradas:', donations.length);
    
    // Si no hay donaciones, retornar array vacío
            if (!donations || donations.length === 0) {
             return [];
            }
    
    // Agrupar por donante
            const donorsMap = {};
    
            donations.forEach(donation => {
                const donorRFC = donation.rfc_donantes;
                const amount = parseFloat(donation.Monto);
                if (!donorsMap[donorRFC]) {
                    donorsMap[donorRFC] = {
                    rfc: donorRFC,
                    totalDonated: 0,
                    count: 0,
                    lastDonation: donation.Fecha
                    };
                }         
      
                donorsMap[donorRFC].totalDonated += amount;
                donorsMap[donorRFC].count += 1;
      
      // Actualizar última donación si es más reciente
                if (new Date(donation.Fecha) > new Date(donorsMap[donorRFC].lastDonation)) {
                    donorsMap[donorRFC].lastDonation = donation.Fecha;
                }
            });
    
    // Convertir a array y ordenar por monto total (mayor a menor)
            const donorsList = Object.values(donorsMap).sort((a, b) => b.totalDonated - a.totalDonated);
    
            console.log('Donantes procesados:', donorsList.length);
            return donorsList;
        } catch (error) {
            console.error('Error en getDonorsByOSC:', error);
            throw error;
        }
      
    }
}
  
module.exports = DonationController;