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

  async getAllOSC(){
    if (!this.initialized) {
        throw new Error('Service not initialized');
    }
    const [rows] = await this.connection.query('SELECT rfc, nombre, descripcion, logo FROM OSC');
    return rows;
  }

  async checkOSC(rfc) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    const [rows] = await this.connection.query('SELECT * FROM OSC WHERE rfc = ?', [rfc]);
    return rows[0];
  }

  async checkRFCdoners(rfc) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    const [rows] = await this.connection.query('SELECT * FROM donantes WHERE rfc = ?', [rfc]);
    return rows[0];
  }
      
  async createDonor(rfc, nombre, contrasena, tipo_persona) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    
    const [result] = await this.connection.query(
      'INSERT INTO donantes (rfc, nombre, contrasena, tipo_persona) VALUES (?, ?, ?, ?)', 
      [rfc, nombre, contrasena, tipo_persona]
    );
    
    return result.insertId;
  }

  async createOSC(rfc, nombre, contrasena, descripcion) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    
    const [result] = await this.connection.query(
      'INSERT INTO OSC (rfc, nombre, contrasena, descripcion) VALUES (?, ?, ?, ?)', 
      [rfc, nombre, contrasena, descripcion]
    );
    
    return result.insertId;
  }
}
  
module.exports = DBService;
  