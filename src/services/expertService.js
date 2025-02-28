const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExpertModel = require('../models/expertModel');

const ExpertService = {
  createExpert: async (expertData) => {
    try {

      const existingExpert = await new Promise((resolve, reject) => {
        ExpertModel.findByEmail(expertData.email, (err, expert) => {
          if (err) return reject(err);
          resolve(expert);
        });
      });

      if (existingExpert) {
        throw new Error('El email ya está registrado');
      }

      const hashedPassword = await bcrypt.hash(expertData.password, 10);
      expertData.password = hashedPassword;

      return new Promise((resolve, reject) => {
        ExpertModel.create(expertData, (err, result) => {  
          if (err) {
            console.error('Error al registrar experto:', err);
            return reject('Error al registrar experto');
          }
          resolve(result);
        });
      });
    } catch (error) {
      console.error('Error en createExpert:', error.message);
      throw new Error(error.message);
    }
  },

  login: async (email, password) => {
    try {
      return new Promise((resolve, reject) => {
        ExpertModel.findByEmail(email, async (err, expert) => {
          if (err) {
            console.error('Error en la consulta de experto:', err);
            return reject(new Error('Error interno al buscar experto'));
          }
          if (!expert) {
            return reject(new Error('Experto no encontrado'));
          }

          console.log('Contraseña ingresada:', password);
          console.log('Contraseña almacenada:', expert.password);

          const isMatch = await bcrypt.compare(password, expert.password);
          console.log('Resultado bcrypt.compare:', isMatch);

          if (!isMatch) {
            return reject(new Error('Credenciales incorrectas'));
          }

          const { password: _, ...expertWithoutPassword } = expert;
          const token = jwt.sign({ id: expert.id, role: expert.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

          resolve({ expert: expertWithoutPassword, token });
        });
      });
    } catch (error) {
      console.error('Error en login:', error);
      throw new Error('Error al iniciar sesión');
    }
  },



  getExpertById: (id) => {
    return new Promise((resolve, reject) => {
      ExpertModel.getExpertById(id, (err, expert) => {
        if (err || !expert) {
          return reject('Experto no encontrado');
        }
        resolve(expert);
      });
    });
  },

  updateExpert: (id, expertData) => {
    return new Promise((resolve, reject) => {
      ExpertModel.updateExpert(id, expertData, (err, result) => {
        if (err) return reject('Error al actualizar experto');
        resolve(expertData);
      });
    });
  },

  deleteExpert: (id) => {
    return new Promise((resolve, reject) => {
      ExpertModel.deleteExpert(id, (err, result) => {
        if (err) return reject('Error al eliminar experto');
        resolve('Experto eliminado correctamente');
      });
    });
  },

  searchExperts: (term) => {
    return new Promise((resolve, reject) => {
      ExpertModel.searchExperts(term, (err, experts) => {
        if (err) return reject('Error en la búsqueda de expertos');
        resolve(experts);
      });
    });
  },
};

module.exports = ExpertService;


