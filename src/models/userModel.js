const db = require('../config/db');

const createUserTable = async () => {
  const query = `
      CREATE TABLE IF NOT EXISTS users (
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
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `;

  try {
      await db.query(query);
      console.log('Tabla users verificada o creada correctamente');
  } catch (error) {
      console.error('Error al verificar/crear la tabla users:', error);
  }
};

createUserTable();

const UserModel = {
  create: (userData, callback) => {
    const query = 'INSERT INTO users (name, last_name, email, password, phone, gender, address, birthdate, role, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [userData.name, userData.last_name, userData.email, userData.password, userData.phone, userData.gender, userData.address, userData.birthdate, userData.role, userData.profile_picture], callback);
  },

  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        console.log("Results from DB: ", results); 
        callback(err, results[0]); 
    });
  },

  update: (id, userData, callback) => {
    const query = 'UPDATE users SET name = ?, last_name = ?, email = ?, phone = ?, gender = ?, address = ?, birthdate = ?, role = ?, profile_picture = ? WHERE id = ?';
    console.log("Ejecutando consulta SQL:", query); 
    db.query(query, [userData.name, userData.last_name, userData.email, userData.phone, userData.gender, userData.address, userData.birthdate, userData.role, userData.profile_picture, id], (err, results) => {
      if (err) {
        console.error('Error en la consulta SQL:', err); 
        return callback(err, null); 
      }
      callback(null, results); 
    });
  }, 

  findById: (id, callback) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) {
        return callback(err);
      }
      if (results.length > 0) {
        return callback(null, results[0]); 
      } else {
        return callback(new Error('Usuario no encontrado')); 
      }
    });
  },
};

module.exports = UserModel;
