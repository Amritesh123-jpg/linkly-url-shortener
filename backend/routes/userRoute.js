
const authController = require('../controller/authController');
const userController = require("../controller/userController");
const express = require('express');
const router = express.Router();
router.get(
  "/",
  authController.protect,
  authController.restrict("admin"),
  userController.getAllUsers

); 


// Logged-in user profile
router.get(
  "/me",
  authController.protect,
  authController.getMe,
  userController.getUser
);

// Update profile
router.patch(
  "/updateMe",
  authController.protect,
  userController.updateMe
);

// Update password
router.patch(
  "/updatePassword",
  authController.protect,
  userController.updatePassword
);

// Delete own account
router.delete(
  "/deleteMe",
  authController.protect,
  userController.deleteMe
);





module.exports = router;