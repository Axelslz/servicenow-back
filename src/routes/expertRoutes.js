const express = require('express');
const router = express.Router();
const ExpertController = require('../controllers/expertController');

router.post('/experts', ExpertController.register);
router.post('/experts/login', ExpertController.login);
router.put('/update/:id', ExpertController.updateExpert);
router.get('/experts/search', ExpertController.search);
router.get('/experts/all', ExpertController.getAllExperts);
router.get('/experts/:id', ExpertController.getExpertById);

module.exports = router;
