import db from "../../models/index.js";
const User = db.user;
const Category = db.category;
import formidable from "formidable";
import fs from "fs";
import path from "path";
const imagepath = path.dirname("/fitnessproject/public/images/.");
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

//category Controller

//getcatebyid controller
export const getcategoryById = async (req, res, next, id) => {
  //Find category AND Send id
  console.log(req.params.cateid);
  const existingcategory = await Category.findOne({
    where: {
      id: req.params.cateid,
    },
  });
  //If  category is existing or not Check
  if (existingcategory) {
    req.category = existingcategory;
    next();
  }
  //No category Found
  else {
    return res.status(400).json({
      error: "no category found",
    });
  }
};

//create category controller
export const createcategory = async (req, res) => {
  try {
    // check for admin
    const ADMIN = await User.findOne({
      where: {
        //this admin is already login or not
        id: req.user.id,
      },
    });
    //check two condition existing and admin or not
    if (ADMIN && req.user.role == 1) {
      // Check Category Does not exist
      const existingcategory = await Category.findOne({
        where: {
          //find category name is already so not create cate gory
          categoryname: req.body.categoryname,
        },
      });
      //category is already existing
      if (existingcategory) {
        return res.status(400).json({
          messages: "category is already existing",
        });
      }
      //this for photo
      const photo = req.file.filename;
      const createcategory = await Category.create({
        categoryname: req.body.categoryname,
        description: req.body.description,
        photo: photo,
      });
      //category created success fully
      res.status(201).json({ createcategory });
    } else {
      //you are not a admin
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

//getcategory controller
export const getcategory = async (req, res) => {
  try {
    //you get category to find
    res.json(req.category);
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//updatecategory controller
export const updatecategory = async (req, res, id) => {
  //console.log({ auth: req.user, cat: req.category });
  try {
    //if admin only updatecategory

    if (req.user.role == 1) {
      const upfilenames = req.category.photo;
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
        const { categoryname, description, photo } = fields;

        //update only two thing category name and description

        const updatedRow = await Category.update(
          {
            categoryname: categoryname,
            description: description,
          },
          {
            //   where category id
            where: {
              id: req.category.id,
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
            `/fitnessproject/public/images/`,
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

          const updatedRow2 = await Category.update(
            {
              //update path
              photo: uphoto,
            },
            {
              where: {
                //update path by id
                id: req.category.id,
              },
            }
          );
          //log of updated or not
          console.log(updatedRow2);
        }
        //Category details Updated successfully
        return res.status(200).json({
          messages: "Category details Updated successfully",
        });
      });
      //you are not admin you can not change data
    } else {
      return res.status(400).json({
        messages: "you are not admin you can not change data",
      });
    }
    //catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
    console.log("err");
  }
};

//Deletecategory controller
export const deletecategory = async (req, res) => {
  try {
    //only admin delete category
    if (req.user.role == 1) {
      //upfile means over orignal path

      const upfilenames = req.category.photo;
      //file and path join for unlink

      const mainupfile = path.join(
        `/fitnessproject/public/images/`,
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

      //ifdeleted row successfully
      const deletedRow = await Category.destroy({
        //delete in db
        where: {
          id: req.category.id,
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
    //catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};
