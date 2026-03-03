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
    async checkRFCdoners(rfc) {
      if (!this.initialized) {
        throw new Error('Service not initialized');
      }
      const [rows] = await this.connection.query('SELECT * FROM donantes WHERE rfc = ?', [rfc]);
      return rows[0];
    }
      
    async createDonor(rfc, nombre, contraseña, tipo_persona) {
  if (!this.initialized) {
    throw new Error('Service not initialized');
  }
  console.log('🎯🎯🎯 ESTA VERSIÓN SÍ SE ESTÁ USANDO - Inserting:', { rfc, nombre, contraseña: '***', tipo_persona });
  
  const [result] = await this.connection.query(
    'INSERT INTO donantes (rfc, nombre, contraseña, tipo_persona) VALUES (?, ?, ?, ?)', 
    [rfc, nombre, contraseña, tipo_persona]
  );
  
  console.log('💾 Service - Insert result:', result);
  return result.insertId;
}
  }
  
  module.exports = DBService;
  