//express for api call
import express from "express";
import { getUserById } from "../../controller/user/user.js";
import { getcategoryById } from "../../controller/category/category.js";
import {
  getcatevideobyId,
  setvideo,
  getvideo,
  updatevideo,
  deletevideo,
} from "../../controller/catevideo/catevideo.js";

//this is router for api call
const router = express.Router();

//getuserbyid
router.param("id", getUserById);

//this route for getcategory by id
router.param("cateid", getcategoryById);

//getcategorybyvideo
router.param("catevideoid", getcatevideobyId);

//setvideo by category
router.post("/setvideo/:cateid/:id", setvideo);

//getcategoryby video
router.get("/:cateid/:id", getvideo);

//updatevideo
router.put("/updatecategoryvideo/:catevideoid/:id", updatevideo);

//deletevideo
router.delete("/deletevideo/:catevideoid/:id", deletevideo);

export default router;
