//express for api call
import express from "express";
//this is for user controller

import {
  registerUser,
  getUserById,
  getUserByUuid,
  verification,
  resendUniqueId,
  signin,
} from "../../controller/user/user.js";

import validateField from "../../middleware/validateField.js";
const router = express.Router();

//simple user sign up route
router.post("/signup", registerUser);

//get user by id
router.param("id", getUserById);

//get user by uuid
router.param("uuid", getUserByUuid);

//User verification Routes
router.get("/verification/:uuid", verification);

//Reset unique Link
router.post("/resenduniqueid", resendUniqueId);

//sign in route
router.post("/signin", signin);

export default router;
