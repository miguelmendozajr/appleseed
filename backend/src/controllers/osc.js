class OSCController {
  constructor(service) {
    this.service = service;
  }

  async login(rfc, password) {
    const osc = await this.service.loginOSC(rfc);
    
    if (!osc) {
      return { success: false, message: 'RFC o contraseña incorrectos' };
    }

    // Compare plain text password (Note: In production, use bcrypt.compare)
    if (osc.contraseña !== password) {
      return { success: false, message: 'RFC o contraseña incorrectos' };
    }

    // Don't return password in response
    const { contraseña, ...oscData } = osc;
    return { success: true, data: oscData };
  }
}

module.exports = OSCController;
