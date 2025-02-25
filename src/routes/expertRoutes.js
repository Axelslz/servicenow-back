const express = require('express');
const ExpertController = require('../controllers/expertController');

const router = express.Router();

router.get('/experts', ExpertController.getAllExperts);
router.get('/experts/:id', ExpertController.getExpertById);
router.post('/experts', ExpertController.createExpert);
router.put('/experts/:id', ExpertController.updateExpert);
router.delete('/experts/:id', ExpertController.deleteExpert);
router.get('/experts/search', ExpertController.searchExperts);

module.exports = router;