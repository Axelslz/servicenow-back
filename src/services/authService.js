const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExpertModel = require('../models/expertModel');
const UserModel = require('../models/userModel');

const AuthService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      // Buscar primero en la tabla de expertos
      ExpertModel.findByEmail(email, async (err, expert) => {
        if (err) return reject(new Error('Error en la consulta de expertos'));

        if (expert) {
          // Verificar contraseña de experto
          const isMatch = await bcrypt.compare(password, expert.password);
          if (!isMatch) return reject(new Error('Credenciales incorrectas'));

          const token = jwt.sign(
            { id: expert.id, role: expert.role, type: 'expert' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          return resolve({ user: expert, token });
        }

        // Si no se encuentra en "experts", buscar en "users"
        UserModel.findByEmail(email, async (err, user) => {
          if (err) return reject(new Error('Error en la consulta de usuarios'));

          if (!user) return reject(new Error('Usuario no encontrado'));

          // Verificar contraseña de usuario
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return reject(new Error('Credenciales incorrectas'));

          const token = jwt.sign(
            { id: user.id, role: user.role, type: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          return resolve({ user, token });
        });
      });
    });
  }
};

module.exports = AuthService;
