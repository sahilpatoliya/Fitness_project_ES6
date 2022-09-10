//express for api call
import express from "express";
import { getUserById } from "../../controller/user/user.js";

//this is for profile controller

import { setprofile } from "../../controller/profile/profile.js";

//this is router for api call
const router = express.Router();

//getuserbyid
router.param("id", getUserById);

//this profile set Route
router.post("/setProfile/:id", setprofile);

export default router;
