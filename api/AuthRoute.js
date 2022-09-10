const express = require("express");
const router = express.Router();
require("cors");


const AuthController = require("../controllers/AuthController");


const Login = AuthController.Login;
const Logout = AuthController.Logout;
const Me = AuthController.Me;

//End point "/" nya adalah "/"
router.get('/me', Me);
router.post("/login", Login);
router.delete("/logout", Logout);

module.exports = router;