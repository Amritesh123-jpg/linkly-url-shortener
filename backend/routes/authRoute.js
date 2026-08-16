const express = require('express');
const authController = require('../controller/authController');
const route = express.Router();



route.post('/sign',authController.signUp);
route.post('/login',authController.login);
route.post("/refresh-token", authController.refreshToken);
route.post("/logout", authController.logout);

console.log("all ready");

module.exports = route;