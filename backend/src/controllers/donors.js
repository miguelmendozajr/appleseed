//controlador para para hacer un match del rfc con la tabla de donantes
class DonorController {
    constructor(service) {
      this.service = service;
    }
  async signup(rfc, nombre, contrasena, tipo_persona) {
    const doner = await this.service.checkRFCdoners(rfc);
    if (doner) {
        throw new Error('RFC ya existe');
    }

    await this.service.createDonor(rfc, nombre, contrasena, tipo_persona);
    return { rfc, nombre, tipo_persona, donadoSeisMeses: 0 };
  }

  async login(rfc, contrasena) {
    const doner = await this.service.checkRFCdoners(rfc);
    if (!doner || doner.contrasena !== contrasena) {
        throw new Error('RFC o contraseña incorrectos');
    }
    const { contrasena: _, ...donerData } = doner;
    const donations = await this.service.getDonorDonations(rfc);
    let amount = 0;
    for (const donation of donations) {
      if (donation.tipo_donacion == 'especie') {
        amount += parseFloat(donation.Valor_estimado);
      } else {
        amount += parseFloat(donation.Monto);
      }
    }

    return { ...donerData, donadoSeisMeses: amount};
  }
}

module.exports = DonorController;