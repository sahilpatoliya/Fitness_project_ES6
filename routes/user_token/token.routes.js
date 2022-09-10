//express for api call
import express from "express";
//this is for token controller

import {
  getuserbyToken,
  genratetoken,
  resetpassword,
} from "../../controller/token/token.js";
//this import is for user unique id
import { getUserByUuid } from "../../controller/user/user.js";
//require router
const router = express.Router();

//get user by uuid
router.param("uuid", getUserByUuid);

//get user by token route
router.param("token", getuserbyToken);

//genrate token route
router.post("/tokengenrate", genratetoken);

//reset Password concept
router.put("/:uuid/:token", resetpassword);

//export router
export default router;
