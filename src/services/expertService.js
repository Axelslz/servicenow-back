const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExpertModel = require('../models/expertModel');

const ExpertService = {
  createExpert: async (expertData) => {
    try {
      expertData.password = await bcrypt.hash(expertData.password, 10);
      return new Promise((resolve, reject) => {
        ExpertModel.create(expertData, (err, result) => {
          if (err) return reject(new Error('Error al registrar experto'));
          resolve({ message: 'Experto registrado exitosamente', id: result.insertId });
        });
      });
    } catch (error) {
      throw new Error('Error en la creación de experto');
    }
  },

  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      ExpertModel.findByEmail(email, async (err, expert) => {
        if (err || !expert) return reject(new Error('Experto no encontrado'));
        const isMatch = await bcrypt.compare(password, expert.password);
        if (!isMatch) return reject(new Error('Credenciales incorrectas'));
        const token = jwt.sign({ id: expert.id, role: expert.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        resolve({ expert, token });
      });
    });
  },

  updateExpert: (id, expertData) => {
    return new Promise((resolve, reject) => {
      ExpertModel.update(id, expertData, (err, result) => {
        if (err) return reject(new Error('Error al actualizar experto'));
        resolve({ message: 'Experto actualizado correctamente', expert: expertData });
      });
    });
  },

  searchExperts: async (query) => {
    return new Promise((resolve, reject) => {
      ExpertModel.searchByNameOrOccupation(query, (err, results) => {
        if (err) {
          console.error('Error en la búsqueda:', err);
          return reject(new Error('Error en la búsqueda de expertos'));
        }
        resolve(results);
      });
    });
  }
};

module.exports = ExpertService;



