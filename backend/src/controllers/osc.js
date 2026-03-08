class OSCController {
  constructor(service) {
    this.service = service;
  }

  async getAll(){
    const oscList = await this.service.getAllOSC();
    return oscList;
  }

  async login(rfc, password) {
    const osc = await this.service.checkOSC(rfc);
    if (!osc) {
      return { success: false, message: 'RFC o contraseña incorrectos' };
    }

    if (osc.contrasena !== password) {
      return { success: false, message: 'RFC o contraseña incorrectos' };
    }

    const { contrasena, ...oscData } = osc;

    return { success: true, data: oscData };
  }

  async signup(rfc, nombre, contrasena, descripcion) {
    const existingOSC = await this.service.checkOSC(rfc);
    if (existingOSC) {
      return { success: false, message: 'RFC ya registrado' };
    }

    await this.service.createOSC(rfc, nombre, contrasena, descripcion);
    return { success: true, data: { rfc, nombre, descripcion } };
  }

  async getOSCDonors(rfc) {
    const existingOSC = await this.service.checkOSC(rfc);
    if (!existingOSC) {
      return { success: false, message: 'OSC no encontrada' };
    }
    const donors = await this.service.getOSCDonors(rfc);
    const donnations = await this.service.getOSCDonations(rfc);

    const lastSixMonths = new Date();
    lastSixMonths.setMonth(lastSixMonths.getMonth() - 6);
    const lastSixMonthsDonations = donnations.filter(donation => new Date(donation.Fecha) >= lastSixMonths);
    
    lastSixMonthsDonations.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));
    
    const donorsWithData = donors.map(donor => {
      const donorAlerts = new Set();
      let totalAmount = 0;
      let pdl = false;
      lastSixMonthsDonations.forEach(donation => {
        if (donation.rfc_donantes === donor.rfc) {
          const amount = donation.Tipo === 'especie' 
            ? parseFloat(donation.Valor_estimado) 
            : parseFloat(donation.Monto);
          totalAmount += amount;
          
          if (donation.Tipo === 'efectivo' && parseFloat(donation.Monto) >= 100000) {
            donorAlerts.add('Donativo en efectivo ≥$100,000 - Verificar documentación reforzada');
          }

          if (!pdl && totalAmount > 376565.10) {
            const donationDate = new Date(donation.Fecha);
            const nextMonth = new Date(donationDate);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                               'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            const monthName = monthNames[nextMonth.getMonth()];
            donorAlerts.add(`Aviso PDL obligatorio - 17 de ${monthName}`);
            pdl = true;
          }

        }
      });
      
      if (totalAmount > 188282.55 && totalAmount <= 376565.10) {
        donorAlerts.add('Identificación Requerida');
      }
      
      return { 
        ...donor, 
        donadoSeisMeses: totalAmount, 
        alertas: Array.from(donorAlerts) 
      };
    });

    return donorsWithData;
  }
}

module.exports = OSCController;