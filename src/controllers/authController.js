const AuthService = require('../services/authService');

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const { user, token } = await AuthService.login(email, password);
      res.json({ user, token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
};

module.exports = AuthController;
