class DonorHttpHandler {
  constructor(donorController) {
    this.donorController = donorController;
  }
  
  async signup(req, res) {
    try {
      const { rfc, nombre, contrasena, tipo_persona } = req.body;
        
      const newDonor = await this.donorController.signup(rfc, nombre, contrasena, tipo_persona);
      res.json(newDonor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { rfc, contrasena } = req.body;
      const donor = await this.donorController.login(rfc, contrasena);
      if (!donor) {
        return res.status(401).json({ error: 'RFC o contraseña incorrectos' });
      }
      res.json(donor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DonorHttpHandler;