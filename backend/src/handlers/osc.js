class OSCHttpHandler {
  constructor(oscController) {
    this.oscController = oscController;
  }

  async getAll(req, res) { 
    try {
      const oscList = await this.oscController.getAll();
      res.json(oscList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { rfc, password } = req.body;

      if (!rfc || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'RFC y contraseña son obligatorios' 
        });
      }

      const result = await this.oscController.login(rfc, password);

      if (!result.success) {
        return res.status(401).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async signup(req, res) {
    try {
      const { rfc, nombre, contrasena, descripcion } = req.body;
      
      if (!rfc || !nombre || !contrasena || !descripcion) {
        return res.status(400).json({ 
          success: false, 
          message: 'RFC, nombre, contraseña y descripción son obligatorios' 
        });
      }
      const result = await this.oscController.signup(rfc, nombre, contrasena, descripcion);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = OSCHttpHandler;
