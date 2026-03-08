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

  async getOSCDonations(rfc){
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    const [rows] = await this.connection.query(
      'SELECT * FROM donaciones WHERE rfc_OSC = ?',
      [rfc]
    );
    return rows;
  }

  async getOSCDonors(rfc){
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    const [rows] = await this.connection.query(
      `SELECT 
        d.rfc,
        d.nombre,
        d.tipo_persona,
        d.codigo_postal_fiscal,
        d.regimen_fiscal,
        d.calle,
        d.numero_exterior,
        d.colonia,
        d.municipio,
        d.estado,
        d.curp,
        d.identificacion,
        d.comprobante_domicilio,
        d.declaracion_beneficiario_controlador,
        d.acta_constitutiva,
        d.poderes_legales,
        d.correo_electronico,
        d.constancia_situacion_fiscal,
        d.telefono
      FROM donantes d 
      JOIN donaciones don ON d.rfc = don.rfc_donantes 
      WHERE don.rfc_OSC = ? 
      GROUP BY d.rfc`,
      [rfc]
    );
    return rows;
  }

  async getDonorDonations(rfc){
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    const [rows] = await this.connection.query(
      'SELECT * FROM donaciones WHERE rfc_donantes = ?',
      [rfc]
    );
    return rows;
  }

  async updateDonor(rfc, updateData) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    
    const fields = [];
    const values = [];
    
    // Build dynamic UPDATE query based on provided fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        fields.push(`${key} = ?`);
        values.push(updateData[key]);
      }
    });
    
    if (fields.length === 0) {
      return; // Nothing to update
    }
    
    values.push(rfc); // Add RFC for WHERE clause
    
    const query = `UPDATE donantes SET ${fields.join(', ')} WHERE rfc = ?`;
    const [result] = await this.connection.query(query, values);
    
    return result;
  }

  async createDonation(donationData) {
    if (!this.initialized) {
      throw new Error('Service not initialized');
    }
    
    const [result] = await this.connection.query(
      `INSERT INTO donaciones (
        Monto,
        Fecha,
        Necesita_CFDI,
        Tipo,
        Valor_estimado,
        rfc_donantes,
        rfc_OSC,
        Declaracion_Origen_Recursos,
        Carta_De_Donacion,
        Acreditacion_Propiedad,
        Acreditacion_Valir_Propiedad
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        donationData.monto || null,
        donationData.fecha,
        donationData.necesitaCFDI ? 1 : 0,
        donationData.tipo,
        donationData.valorEstimado || null,
        donationData.rfc_donantes,
        donationData.rfc_osc,
        donationData.declaracionOrigenRecursos || null,
        donationData.cartaDonacion || null,
        donationData.acreditacionPropiedad || null,
        donationData.acreditacionValorPropiedad || null
      ]
    );
    
    return result.insertId;
  }
}
  
module.exports = DBService;
  