class LawyerHttpHandler {
    constructor(lawyerController) {
      this.lawyerController = lawyerController;
    }
  
    async getAllLawyers(req, res) {
      try {
        const lawyers = await this.lawyerController.getAll();
        res.json(lawyers);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
  }
  
  // Export the class directly
  module.exports = LawyerHttpHandler;
  