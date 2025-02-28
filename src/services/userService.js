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
            return reject(new Error('Error al registrar usuario'));
          }
          resolve({ message: 'Usuario registrado exitosamente', id: result.insertId });
        });
      });
    } catch (error) {
      console.error('Error en createUser:', error);
      throw new Error('Error en la creación de usuario');
    }
  },

  login: async (email, password) => {
    try {
      return new Promise((resolve, reject) => {
        UserModel.findByEmail(email, async (err, user) => {
          if (err) {
            console.error('Error en la consulta de usuario:', err);
            return reject(new Error('Error interno al buscar usuario'));
          }
          if (!user) {
            return reject(new Error('Usuario no encontrado'));
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return reject(new Error('Credenciales incorrectas'));
          }

          const { password: _, ...userWithoutPassword } = user;
          const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

          resolve({ user: userWithoutPassword, token });
        });
      });
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Error al iniciar sesión');
    }
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      UserModel.findById(id, (err, user) => {
        if (err) {
          console.error('Error al obtener usuario:', err);
          return reject(new Error('Error al obtener usuario'));
        }
        if (!user) {
          return reject(new Error('Usuario no encontrado'));
        }
        resolve(user);
      });
    });
  },

  resetPassword: (userId, newPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error al encriptar la contraseña:', err);
          return reject(new Error('Error al encriptar la contraseña'));
        }

        const query = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(query, [hashedPassword, userId], (error, result) => {
          if (error) {
            console.error('Error al actualizar la contraseña:', error);
            return reject(new Error('Error al actualizar la contraseña'));
          }
          resolve({ message: 'Contraseña actualizada correctamente' });
        });
      });
    });
  },

  updateUser: (id, userData) => {
    return new Promise((resolve, reject) => {
      UserModel.update(id, userData, (err, result) => {
        if (err) {
          console.error('Error al actualizar usuario:', err);
          return reject(new Error('Error al actualizar usuario'));
        }
        resolve({ message: 'Usuario actualizado correctamente', user: userData });
      });
    });
  },
};

module.exports = UserService;
