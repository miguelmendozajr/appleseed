class LawyerController {
    constructor(service) {
      this.service = service;
    }
    async getAll() {
        const lawyers = await this.service.getAllLawyers();
        return lawyers;
    }
}
  
module.exports = LawyerController;