// controllers/expertController.js
const ExpertService = require('../services/expertService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { cloudinary } = require('../config/cloudinary');

const ExpertController = {
  register: async (req, res) => {
    try {
      const expertData = req.body;
      await ExpertService.createExpert(expertData);
      res.status(201).json({ message: `Bienvenido, ${expertData.name} ${expertData.last_name}! Registro Exitoso.` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await ExpertService.login(email, password);
      const { password: _, ...expertWithoutPassword } = result.expert;
      res.status(200).json({
        message: 'Login exitoso',
        expert: expertWithoutPassword,
        token: result.token
      });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  updateExpert: async (req, res) => {
    try {
      const expertId = req.params.id;
      const updatedData = req.body;
      
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'ExpertImg-Agentlite',
            resource_type: 'image'
          }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });
          uploadStream.end(req.file.buffer);
        });
        updatedData.profile_picture = result.secure_url;
      }

      const updatedExpert = await ExpertService.updateExpert(expertId, updatedData);
      const token = jwt.sign({ id: updatedExpert.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({
        message: 'Experto actualizado exitosamente',
        expert: updatedExpert.expert,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: `Error al actualizar el experto: ${error.message}` });
    }
  }
};

module.exports = ExpertController;


