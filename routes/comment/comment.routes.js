//express for api call
import express from "express";
import { getUserById } from "../../controller/user/user.js";
import { getcategoryById } from "../../controller/category/category.js";
import { getcatevideobyId } from "../../controller/catevideo/catevideo.js";
import {
  getcommentByid,
  setcomment,
} from "../../controller/comment/comment.js";

//this is router for api call
const router = express.Router();

//getuserbyid
router.param("id", getUserById);

//this route for getcategory by id
router.param("cateid", getcategoryById);

//getcategorybyvideo
router.param("catevideoid", getcatevideobyId);

//get comment by id
router.param("commentid", getcommentByid);

//set comment by user
router.post("/:catevideoid/:cateid/:id", setcomment);

export default router;
