const db = require('../config/db');

const createExpertTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS experts (
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
      console.log('Tabla experts verificada o creada correctamente');
  } catch (error) {
      console.error('Error al verificar/crear la tabla experts:', error);
  }
};

createExpertTable();

const ExpertModel = {
  create: (expertData, callback) => {
    const query = 'INSERT INTO experts (name, last_name, email, password, phone, gender, address, birthdate, role, profile_picture, ocupation, experience) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [expertData.name, expertData.last_name, expertData.email, expertData.password, expertData.phone, expertData.gender, expertData.address, expertData.birthdate, expertData.role, expertData.profile_picture, expertData.ocupation, expertData.experience], callback);
  },

  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM experts WHERE email = ?';
    db.query(query, [email], (err, results) => {
        callback(err, results[0]);
    });
  },

  update: (id, expertData, callback) => {
    const query = 'UPDATE experts SET name = ?, last_name = ?, email = ?, phone = ?, gender = ?, address = ?, birthdate = ?, role = ?, profile_picture = ?, ocupation = ?, experience = ? WHERE id = ?';
    db.query(query, [expertData.name, expertData.last_name, expertData.email, expertData.phone, expertData.gender, expertData.address, expertData.birthdate, expertData.role, expertData.profile_picture, expertData.ocupation, expertData.experience, id], callback);
  },

  findById: (id, callback) => {
    const sql = 'SELECT * FROM experts WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0 ? results[0] : null);
    });
  },
  searchByNameOrOccupation: (query, callback) => {
    const sql = `
      SELECT * FROM experts
      WHERE name LIKE ? OR ocupation LIKE ?;
    `;
    const searchTerm = `%${query}%`; // Permite búsqueda parcial
    db.query(sql, [searchTerm, searchTerm], callback);
  },

  getAll: (callback) => {
    const sql = 'SELECT * FROM experts';
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM experts WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length > 0) {
        return callback(null, results[0]); // Retorna solo el primer resultado
      } else {
        return callback(null, null); // No se encontró el experto
      }
    });
  }
};

module.exports = ExpertModel;
