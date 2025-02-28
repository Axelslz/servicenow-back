const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'odoo123'; 

const createExpertTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS expert (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(255),
          gender VARCHAR(255),
          address VARCHAR(255),
          birthdate DATE,
          role VARCHAR(255),
          profile_picture VARCHAR(255),
          ocupation VARCHAR(255),
          experience INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `;

  try {
      await db.query(query);
      console.log('Tabla expert verificada o creada correctamente');
  } catch (error) {
      console.error('Error al verificar/crear la tabla expert:', error);
  }
};

createExpertTable();

const ExpertModel = {
  create: async (expertData, callback) => {
    try {
      const hashedPassword = await bcrypt.hash(expertData.password, 10);
      const query = 'INSERT INTO expert (name, last_name, email, password, phone, gender, address, birthdate, role, profile_picture, ocupation, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      
      db.query(query, [
        expertData.name,
        expertData.last_name,
        expertData.email,
        hashedPassword,
        expertData.phone,
        expertData.gender,
        expertData.address,
        expertData.birthdate,
        expertData.role,
        expertData.profile_picture,
        expertData.ocupation,
        expertData.experience
      ], callback);
    } catch (error) {
      callback(error, null);
    }
  },

  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM expert WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error en findByEmail:', err);
        return callback(err, null);
      }
      console.log('Resultados de findByEmail:', results);
      callback(null, results[0]); 
    });
  },

  update: (id, expertData, callback) => {
    const query = 'UPDATE expert SET name = ?, last_name = ?, email = ?, phone = ?, gender = ?, address = ?, birthdate = ?, role = ?, profile_picture = ?, ocupation = ?, experience = ? WHERE id = ?';
    
    db.query(query, [
      expertData.name,
      expertData.last_name,
      expertData.email,
      expertData.phone,
      expertData.gender,
      expertData.address,
      expertData.birthdate,
      expertData.role,
      expertData.profile_picture,
      expertData.ocupation,
      expertData.experience,
      id
    ], callback);
  }, 

  findById: (id, callback) => {
    const sql = 'SELECT * FROM expert WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length > 0) {
        return callback(null, results[0]); 
      } else {
        return callback(new Error('Experto no encontrado')); 
      }
    });
  },
};

module.exports = ExpertModel;
