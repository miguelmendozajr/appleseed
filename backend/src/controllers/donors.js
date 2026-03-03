//controlador para para hacer un match del rfc con la tabla de donantes
class DonorController {
    constructor(service) {
      this.service = service;
    }
  async singup(rfc, nombre, contraseña, tipo_persona) {
    console.log('📝 Controller - Received:', { rfc, nombre, contraseña: '***', tipo_persona });
    
    const doner = await this.service.checkRFCdoners(rfc);
    console.log('📝 Controller - Check RFC result:', doner ? 'Found' : 'Not found');
    
    if (doner) {
        throw new Error('RFC already exists');
    }
    
    console.log('📝 Controller - Creating donor with:', { rfc, nombre, contraseña: '***', tipo_persona });
    const newDonerId = await this.service.createDonor(rfc, nombre, contraseña, tipo_persona);
    console.log('📝 Controller - Created with ID:', newDonerId);
    
    return {id: newDonerId, rfc, nombre, tipo_persona};
  }
}

module.exports = DonorController;