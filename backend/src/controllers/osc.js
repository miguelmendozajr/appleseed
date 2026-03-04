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

    // Compare plain text password (Note: In production, use bcrypt.compare)
    if (osc.contrasena !== password) {
      return { success: false, message: 'RFC o contraseña incorrectos' };
    }

    // Don't return password in response
    const { contrasena, ...oscData } = osc;
    return { success: true, data: oscData };
  }
}

module.exports = OSCController;
