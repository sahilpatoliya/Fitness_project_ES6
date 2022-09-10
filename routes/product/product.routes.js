import express from "express";
import { getUserById } from "../../controller/user/user.js";
import {
  getProductByid,
  setproduct,
  updateproduct,
  getproduct,
  deleteproduct,
} from "../../controller/product/product.js";

//multer for send image is particular file
import multer from "multer";

//path for ensilize
import path from "path";

//this is for image set in path
const imagepath = path.dirname("/fitnessproject/public/productimages/.");

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

//getproduct by id
router.param("productid", getProductByid);

//setproduct by admin
router.post("/setproduct/:id", upload.single("photo"), setproduct);

//update product
router.put("/updateproduct/:productid/:id", updateproduct);

//get product
router.get("/getproduct/:productid/:id", getproduct);

//delete product
router.delete("/deleteproduct/:productid/:id", deleteproduct);

export default router;
