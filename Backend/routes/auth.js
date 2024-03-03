const express = require('express');
const authController=require('../controllers/authController');
const router = express.Router();
router.post('/signup', authController.signup);
router.post('/signin',authController.authenticateJWT,authController.signin);
router.post('/verify-otp',authController.authenticateJWT,authController.verifyotp);
module.exports=router;