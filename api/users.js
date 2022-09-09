const express = require("express");
const router = express.Router();
require("cors");



const Usercontrollers = require("../controllers/UserController");
const getUsers = Usercontrollers.getUsers;
const saveUser = Usercontrollers.saveUser;
const getUserById = Usercontrollers.getUserById;
const deleteUser = Usercontrollers.deleteUser;
const updateUser = Usercontrollers.updateUser;

const AuthUser = require("../middleware/AuthUser");
const verifyUser = AuthUser.verifyUser;
const adminOnly = AuthUser.adminOnly;

//End point "/" nya adalah /api/users
router.get('/', verifyUser, adminOnly, getUsers); //get all user
router.post("/", verifyUser, adminOnly, saveUser); //add a user
router.get("/:id", verifyUser, adminOnly, getUserById); //find user by id
router.delete("/:id", verifyUser, adminOnly, deleteUser); //delete user
router.patch("/:id", verifyUser, adminOnly, updateUser); //update user

module.exports = router;