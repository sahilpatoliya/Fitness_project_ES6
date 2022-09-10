//express for api call
import express from "express";
import { getUserById } from "../../controller/user/user.js";

import {
  getcategoryById,
  createcategory,
  getcategory,
  updatecategory,
  deletecategory,
} from "../../controller/category/category.js";
//multer for send image is particular file
import multer from "multer";

//path for ensilize
import path from "path";

//this is for image set in path
const imagepath = path.dirname("/fitnessproject/public/images/.");

//file storage for use of multer
const filestorage = multer.diskStorage({
  //destination
  destination: (req, file, cb) => {
    cb(null, imagepath);
  },
  //find filename to path
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "--" + file.originalname);
  },
});
//this uploud is our main middleware
const upload = multer({ storage: filestorage });

//this is router for api call
const router = express.Router();

//getuserbyid
router.param("id", getUserById);

//this route for getcategory by id
router.param("cateid", getcategoryById);

//create category route
router.post("/createcategory/:id", upload.single("photo"), createcategory);

//how to get category by id route
router.get("/:cateid", getcategory);

//updatecategoryroute
router.put("/updatecategory/:cateid/:id", updatecategory);

//DeleteCategory
router.delete("/deletecategory/:cateid/:id", deletecategory);

export default router;
