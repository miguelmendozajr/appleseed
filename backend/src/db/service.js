const mysql = require('mysql2/promise');

class DBService {
  constructor() {
    this.initialized = false;
    this.connection = null;
  }

  async initialize() {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000
    });
    this.initialized = true;
  }

  async getAllLawyers() {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    const [rows] = await this.connection.query('SELECT * FROM abogados');
    return rows;
  }

  async loginOSC(rfc) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    const [rows] = await this.connection.query('SELECT * FROM OSC WHERE rfc = ?', [rfc]);
    return rows[0];
  }
}
  
  module.exports = DBService;
  