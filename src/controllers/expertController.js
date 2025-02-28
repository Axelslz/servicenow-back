const ExpertService = require('../services/expertService');

const ExpertController = {
    getAllExperts: async (req, res) => {
        try {
            const experts = await ExpertService.getAllExperts();
            res.json(experts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getExpertById: async (req, res) => {
        try {
            const { id } = req.params;
            const expert = await ExpertService.getExpertById(id);
            if (expert.length === 0) return res.status(404).json({ message: 'Expert not found' });
            res.json(expert[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createExpert: async (req, res) => {
        try {
            const expertData = req.body;
            const { name, last_name } = expertData;
            await ExpertService.createExpert(expertData);
            res.status(201).json({ message: `Bienvenido, ${name} ${last_name}! Registro Exitoso.` });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateExpert: async (req, res) => {
        try {
            const { id } = req.params;
            const expertData = req.body;
            await ExpertService.updateExpert(id, expertData);
            res.json({ message: 'Expert updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteExpert: async (req, res) => {
        try {
            const { id } = req.params;
            await ExpertService.deleteExpert(id);
            res.json({ message: 'Expert deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    searchExperts: async (req, res) => {
        try {
            const { term } = req.query;
            if (!term) return res.status(400).json({ message: "Search term is required" });

            const experts = await ExpertService.searchExperts(term);
            if (experts.length === 0) return res.status(404).json({ message: 'No experts found' });

            res.json(experts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
          const result = await ExpertService.login(email, password);
          const { password: _password, ...expertWithoutPassword } = result.expert;
    
          res.status(200).json({
            message: 'Login exitoso',
            expert: {
              ...expertWithoutPassword,
              profile_picture: result.expert.profile_picture,
            },
            token: result.token,
          });
        } catch (error) {
          console.error('Error en login:', error);
          res.status(401).json({ message: error.message || 'Error en autenticación' });
        }
    }
      
};

module.exports = ExpertController;