
const express= require('express');
const router= express.Router();
const userController= require('../controllers/userController');
const authController= require('../controllers/authController');
const profileController=require('../controllers/profileController');

//routes for user

//routes for book browsing

router.get('/books',authController.authenticateJWT,userController.getAllBooks);

// route for seeing particular book
router.get('/books/:id',authController.authenticateJWT, userController.getBook);

// routes for order placement 

router.post('/orders',authController.authenticateJWT,userController.placeOrders);
// route for viewing all the orders
router.get('/orders',authController.authenticateJWT,userController.getOrders);
// route for viewing particular order
router.get('/orders/:id',authController.authenticateJWT,userController.getOrder);

// routes for profile management 
// route for seeing the profile
// router.get('/profile',authController.authenticateJWT,profileController.getProfile);

// route for creating profile for the first time 
router.get('/profile',authController.authenticateJWT,profileController.postProfile);

router.put('/profile',authController.authenticateJWT,profileController.updateProfile );

module.exports = router;

