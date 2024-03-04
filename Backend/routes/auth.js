const express = require('express');
const authController=require('../controllers/authController');
const router = express.Router();
router.post('/signup', authController.signup);
router.post('/signin',authController.authenticateJWT,authController.signin);
router.post('/verify-otp',authController.authenticateJWT,authController.verifyotp);
router.get('/resend-otp',authController.authenticateJWT,authController.resendOtp);
router.get('/forgot-password',authController.authenticateJWT,authController.forgotPassword);
router.get('/reset-password',authController.authenticateJWT,authController.resetPasswordUrl);
router.post('/reset-password',authController.authenticateJWT,authController.resetPassword);

module.exports=router;