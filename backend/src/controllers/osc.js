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
}

module.exports = OSCController;