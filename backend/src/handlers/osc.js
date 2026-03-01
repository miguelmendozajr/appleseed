class OSCHttpHandler {
  constructor(oscController) {
    this.oscController = oscController;
  }

  async login(req, res) {
    try {
      const { rfc, password } = req.body;

      // Validate input
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
}

module.exports = OSCHttpHandler;
