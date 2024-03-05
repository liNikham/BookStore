const express = require('express');
const authController=require('../controllers/authController');
const profileController= require('../controllers/profileController');
const router = express.Router();
router.post('/signup', authController.signup);
router.post('/signin',authController.authenticateJWT,authController.signin);
router.post('/verify-otp',authController.authenticateJWT,authController.verifyotp);
router.get('/resend-otp',authController.authenticateJWT,authController.resendOtp);
router.get('/forgot-password',authController.authenticateJWT,authController.forgotPassword);
router.get('/reset-password',authController.authenticateJWT,authController.resetPasswordUrl);
router.post('/reset-password',authController.authenticateJWT,authController.resetPassword);


// ye routes user ke profile ko access ya fir update karne ke liye 
router.post('/profile',authController.authenticateJWT,profileController.postProfile);
router.put('/profile',authController.authenticateJWT, profileController.updateProfile);


module.exports=router;