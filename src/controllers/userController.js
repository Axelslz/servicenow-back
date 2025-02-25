const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { cloudinary } = require('../config/cloudinary');

const generatePasswordResetToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign({ id: userId }, secret, { expiresIn: '90s' });
};

const verifyPasswordResetToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const sendPasswordResetEmail = async (email, token) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `https://yourfrontend.com/reset-password/${token}`;
  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Restablecer contraseña',
    text: `Haz clic en este enlace para restablecer tu contraseña: ${resetLink}. El enlace expirará en 1.5 minutos.`,
  };

  await transporter.sendMail(mailOptions);
};

const UserController = {
  register: (req, res) => {
    const { name, last_name, email, password, phone, gender, address, birthdate, role } = req.body;
    const userData = { name, last_name, email, password, phone, gender, address, birthdate, role, profile_picture: null }; // Sin imagen

    UserService.createUser(userData)
      .then(() => {
        res.status(201).json({ message: `Bienvenido, ${name} ${last_name}! Registro Exitoso.` });
      })
      .catch((error) => {
        res.status(500).json({ message: error });
      });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await UserService.login(email, password);

      // Excluye la contraseña de la respuesta
      const { password: _password, ...userWithoutPassword } = result.user;

      res.status(200).json({
        message: 'Login exitoso',
        user: {
          ...userWithoutPassword,  // Todos los datos del usuario excepto la contraseña
          profile_picture: result.user.profile_picture  // Agregar explícitamente el link de la imagen de perfil
        },
        token: result.token  // El token JWT
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(401).json({ message: error.message || 'Error en autenticación' });
    }
  },

  requestPasswordReset: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await UserService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const token = generatePasswordResetToken(user.id);
      await sendPasswordResetEmail(user.email, token);

      res.json({ message: 'Se ha enviado un enlace para restablecer la contraseña' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const result = await UserService.resetPassword(decoded.id, hashedPassword);
      res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
      res.status(400).json({ message: 'Token inválido o expirado' });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;

    try {
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({
            folder: 'UserImg-Agentlite',
            resource_type: 'image'
          }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          });

          if (req.file && req.file.buffer) {
            uploadStream.end(req.file.buffer);
          } else {
            throw new Error("Archivo no encontrado o formato inválido.");
          }
        });
        updatedData.profile_picture = result.secure_url; 
      }

      const updatedUser = await UserService.updateUser(userId, updatedData);

      const token = jwt.sign({ id: updatedUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      const { password, ...userWithoutPassword } = updatedUser;

      res.status(200).json({
        message: 'Usuario actualizado exitosamente',
        user: userWithoutPassword,
        token, 
      });
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ message: `Error al actualizar el usuario: ${error.message || error}` });
    }
  },
};

module.exports = UserController;






