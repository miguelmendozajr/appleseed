class DonerHttpHandler {
    constructor(donorController) {
      this.donorController = donorController;
    }
  
     async login(req, res) {
  try {
    console.log('Request body:', req.body);
    const { rfc, nombre, contraseña, tipo_persona } = req.body;
    console.log('Extracted:', { rfc, nombre, contraseña: '***', tipo_persona });
    
    const newDoner = await this.donorController.singup(rfc, nombre, contraseña, tipo_persona);
    res.json(newDoner);
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: error.message });
  }
  }
}

// Export the class directly
module.exports = DonerHttpHandler;