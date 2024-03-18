const express= require('express');
const router= express.Router();
const adminController = require('../controllers/adminController');
const authController= require('../controllers/authController');
// Book management routes  for owner 
// route for veiwing all the bookks
router.get('/books',authController.authenticateJWT,adminController.getAllBooks);
// route for getting the particular book 
router.get('/books/:id',authController.authenticateJWT,adminController.getBook);
// route for adding the new book
router.post('/add-book',authController.authenticateJWT,adminController.addBook);
//route for update the details of the book 
router.put('/update-book/:id',authController.authenticateJWT,adminController.updateBook);
// route for deleting the book
router.delete('/delete-book/:id',authController.authenticateJWT,adminController.deleteBook);


// routes for order management for ownere
// route for seeing the orders of the book
router.get('/orders',authController.authenticateJWT,adminController.getAllOrders);
// route for getting details of the particular order

router.get('/orders/:id',authController.authenticateJWT,adminController.getOrder)
// route for updating the status of the order 
router.put('/orders/:id',authController.authenticateJWT,adminController.updateOrder);

// user management routes for owner
// route for getting all users 
// router.get('/users',authController.authenticateJWT,adminController.getAllUsers);

// // route for getting the details of the particular users
// router.get('/users/:id',authController.authenticateJWT,adminController.getUser);
// // route for deleting the particular user
// router.delete('/users/:id',authController.authenticateJWT,adminController.deleteUser);
module.exports=router;