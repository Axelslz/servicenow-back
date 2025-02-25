const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/password-reset', UserController.requestPasswordReset);
router.post('/reset-password/:token', UserController.resetPassword);
router.put('/update/:id', authMiddleware, upload.single('profile_picture'), UserController.updateUser);

module.exports = router;

