const express = require("express");
const router = express.Router();
require("cors");

const Usercontrollers = require("../controllers/UserController");
const getUsers = Usercontrollers.getUsers;
const saveUser = Usercontrollers.saveUser;
const getUserById = Usercontrollers.getUserById;
const deleteUser = Usercontrollers.deleteUser;
const updateUser = Usercontrollers.updateUser;

//End point "/" nya adalah /api/users
router.get('/', getUsers);
router.post("/", saveUser);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

module.exports = router;