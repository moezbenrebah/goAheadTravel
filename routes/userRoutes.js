const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Open to everyone
router.post('/signup', userController.uploadPhotos, userController.resizeProfileImage, authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logOut);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

// Open to authenticate users middleware
router.use(authController.grantAcess);

router.patch('/updatepassword', authController.authorization('admin', 'user'), authController.updatePassword);
router.patch('/updatemydata', userController.uploadPhotos, userController.resizeProfileImage, userController.updateMyData);
router.delete('/deletemyaccount', authController.authorization('user'), userController.deleteUserAccount)

// Get the current user account
router.get('/me', authController.authorization('admin', 'user'), userController.getMe, userController.getUser);

// Restrict to admin
router.use(authController.authorization('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.addUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
