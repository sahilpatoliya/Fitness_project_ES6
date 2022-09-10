import db from "../../models/index.js";
const User = db.user;
const Product = db.product;
import formidable from "formidable";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
const imagepath = path.dirname("/fitnessproject/public/productimages/.");
import {
  sendError,
  sendSuccess,
  sendBadRequest,
} from "../../utilities/response.js";
import messages from "../../utilities/messages.js";
/**
 * Profile
 * @param req
 * @param res
 */

//product Controller

//getproduct by id controller
export const getProductByid = async (req, res, next, id) => {
  //Perform find one opration and find product is existing or not
  const existingproduct = await Product.findOne({
    where: {
      id: id,
    },
  });
  //if product is alreadt existing
  if (existingproduct) {
    (req.product = existingproduct), next();
  }
  //product not found
  else {
    return res.status(400).json({
      error: "no product found",
    });
  }
};

//set product by admin
export const setproduct = async (req, res) => {
  try {
    //check admin
    const admin = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    //check admin by role
    if (admin && req.user.role == 1) {
      //then find product is already existing or not
      const existingproduct = await Product.findOne({
        where: {
          productname: req.body.productname,
        },
      });

      //if existingproduct so this mes call
      if (existingproduct) {
        return res.status(400).json({
          messages: "product is already existing",
        });
      }

      //if not existingproduct so product create
      const photo = req.file.filename;
      const createproduct = await Product.create({
        productname: req.body.productname,
        description: req.body.description,
        photo: photo,
      });
      //token genrate base on email id and uuid
      const token = jwt.sign(
        {
          modelid: createproduct.modelid,
        },
        process.env.JWT_ACC,
        {
          //token expiresInis 24h
          expiresIn: "7d",
        }
      );
      const split = token.split(".");
      console.log();
      const link = `${process.env.BASE_URL}/product/${split[0]}`;

      //then so data
      res.status(201).json({ token, link, createproduct });
    }
    //You are not admin
    else {
      return res.status(400).json({
        messages: "You Are not Admin",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//update product by admin
export const updateproduct = async (req, res) => {
  try {
    //if admin only updateproduct

    if (req.user.role == 1) {
      const upfilenames = req.product.photo;
      console.log({ upfilenames });
      //this is form data

      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.uploadDir = imagepath;

      //form parseing
      form.parse(req, async (err, fields, file) => {
        //if any error in form parse
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "problem with image",
          });
        }

        //destructure
        const { productname, description } = fields;

        //update only two thing product name and description

        const updatedRow = await Product.update(
          {
            productname: productname,
            description: description,
          },
          {
            //   where product id
            where: {
              id: req.product.id,
            },
          }
        );
        //if proper file add and update
        if (file && file.photo && file.photo.originalFilename) {
          //this is over orignal path
          const filephoto = file.photo.originalFilename;

          //over orignal file path
          const fileName1 =
            "\\" + new Date().getTime() + "--" + file.photo.originalFilename;

          //this is over orignal path
          const oldfilepath = file.photo.filepath;

          // this is new path join and rename this path

          const newfilepath = path.join(imagepath, fileName1);

          // clg of two path
          console.log(oldfilepath, newfilepath);

          //rename over two path

          fs.rename(oldfilepath, newfilepath, (err) => {
            //if any error in rename path
            if (err) console.log(err);
            //phoro rename successfully
            else {
              console.log("Photo rename successfully");
            }
          });

          //over main pic is unlink and new photo is added

          const mainupfile = path.join(
            `/fitnessproject/public/productimages/`,
            upfilenames
          );
          console.log({ upfilenames, mainupfile });

          //unlink over photo

          fs.unlink(mainupfile, (err) => {
            //if error in unlink
            if (err) console.log(err);
            //photodeleted success fully
            else {
              console.log("deleted photo successfully");
            }
          });

          //database in save over new file path with date
          const uphoto =
            new Date().getTime() + "--" + file.photo.originalFilename;

          const updatedRow2 = await Product.update(
            {
              //update path
              photo: uphoto,
            },
            {
              where: {
                //update path by id
                id: req.product.id,
              },
            }
          );
          //log of updated or not
          console.log(updatedRow2);
        }
        //product details Updated successfully
        return res.status(200).json({
          messages: "product details Updated successfully",
        });
      });
      //you are not admin you can not change data
    } else {
      return res.status(400).json({
        messages: "you are not admin you can not change data",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//getproduct only admin
export const getproduct = async (req, res) => {
  try {
    //you are admin
    if (req.user.role == 1) {
      //find product by id
      const find = await Product.findOne({
        where: {
          id: req.product.id,
        },
      });

      //you get product to find
      res.json(find);
    }
    //not admin so call else
    else {
      return res.status(400).json({
        messages: "You Are not Admin",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//deleteproduct by admin
export const deleteproduct = async (req, res) => {
  try {
    //only admin delete product
    if (req.user.role == 1) {
      //upfile means over orignal path

      const upfilenames = req.product.photo;
      //file and path join for unlink

      const mainupfile = path.join(
        `/fitnessproject/public/productimages/`,
        upfilenames
      );

      //unlink and delete in folder

      fs.unlink(mainupfile, (err) => {
        //if err in unlink file
        if (err) console.log(err);
        //file unlink successfully
        else {
          console.log("deleted photo successfully");
        }
      });

      //if deleted row successfully
      const deletedRow = await Product.destroy({
        //delete in db
        where: {
          id: req.product.id,
        },
      });

      console.log(deletedRow);

      //if deleted row successfully

      if (deletedRow) {
        res.status(200).json({
          messages: "Deleted Row successfully",
        });
      }
      //some issue in delete
      else {
        res.status(400).json({
          messages: "Not row Deleted",
        });
      }
    }
    //you are not and admin
    else {
      res.status(400).json({
        messages: "you are not admin you can not change data",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};
