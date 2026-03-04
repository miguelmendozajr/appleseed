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
    return { rfc, nombre, tipo_persona };
  }

  async login(rfc, contrasena) {
    const doner = await this.service.checkRFCdoners(rfc);
    if (!doner || doner.contrasena !== contrasena) {
        throw new Error('RFC o contraseña incorrectos');
    }
    const { contrasena: _, ...donerData } = doner;
    return donerData;
  }
}

module.exports = DonorController;