const express = require('express');
const router = express.Router();
const ExpertController = require('../controllers/expertController');

router.post('/experts', ExpertController.register);
router.post('/experts/login', ExpertController.login);
router.put('/update/:id', ExpertController.updateExpert);

module.exports = router;
