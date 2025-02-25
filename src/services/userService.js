const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const UserService = {
  createUser: async (userData) => {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;

      return new Promise((resolve, reject) => {
        UserModel.create(userData, (err, result) => {
          if (err) {
            console.error('Error al crear usuario:', err);
            return reject('Error al registrar usuario');
          }
          resolve(result);
        });
      });
    } catch (error) {
      console.error('Error en createUser:', error);
      throw new Error('Error en la creación de usuario');
    }
  },

  login: (email, password) => {
    return new Promise((resolve, reject) => {
      UserModel.findByEmail(email, async (err, user) => {
        if (err || !user) {
          return reject('Usuario no encontrado');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return reject('Credenciales incorrectas');
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        resolve({ user, token });
      });
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      UserModel.findById(id, (err, user) => {
        if (err || !user) {
          return reject('Usuario no encontrado');
        }
        resolve(user);
      });
    });
  },

  resetPassword: (userId, newPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) return reject('Error al encriptar la contraseña');

        const query = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(query, [hashedPassword, userId], (error, result) => {
          if (error) return reject('Error al actualizar la contraseña');
          resolve('Contraseña actualizada correctamente');
        });
      });
    });
  },

  updateUser: (id, userData) => {
    return new Promise((resolve, reject) => {
      UserModel.update(id, userData, (err, result) => {
        if (err) return reject('Error al actualizar usuario');
        resolve(userData);
      });
    });
  },
};

module.exports = UserService;
