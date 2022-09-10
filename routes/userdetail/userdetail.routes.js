//express for api call
import express from "express";
import { getUserById } from "../../controller/user/user.js";

import { expressjwt } from "express-jwt";
import { body, validationResult } from "express-validator";

//this is for userdetail controller

import {
  setuserdetail,
  getuserdetailbyId,
  updateuserdetail,
  deletedetail,
  getdetailbyadmin,
  getuserdetail,
} from "../../controller/userdetail/userdetail.js";

//this is router for api call
const router = express.Router();

//getuserbyid
router.param("id", getUserById);

//getuserdetailbyid
router.param("userid", getuserdetailbyId);

//set user detail
router.post(
  "/setuserdetail/:id",
  expressjwt({ secret: "sahil@33333", algorithms: ["HS256"] }),
  setuserdetail
);

//updatedetail
router.put(
  "/updateuserdetail/:userid/:id",
  [
    body("step").isInt().exists(),
    body("calories").isFloat().exists(),
    body("sleep").isInt().exists(),
    body("heartrate").isFloat().exists(),
    body("temperature").isFloat().exists(),
    body("weight").isInt().exists(),
    body("bloodpressure").isFloat().exists(),
    body("oxygen").isFloat().exists(),
  ],

  updateuserdetail
);

//deletedetail route
router.delete("/deletedetail/:userid/:id", deletedetail);

//getdetail user
router.get("/getadmin/:userid/:id", getdetailbyadmin);

//getUserDetailBy link
router.get(
  "/:userid/:id",
  expressjwt({ secret: "sahil@33333", algorithms: ["HS256"] }),
  getuserdetail
);

export default router;
