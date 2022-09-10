import db from "../../models/index.js";
const User = db.user;
const Category = db.category;
const Catevideo = db.catevideo;
import formidable from "formidable";
import fs from "fs";
import path from "path";
const imagepath = path.dirname("/fitnessproject/public/videos/.");
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

//category video Controller

//getcatevideoby id controller
export const getcatevideobyId = async (req, res, next, id) => {
  const existingcategoryvideo = await Catevideo.findOne({
    where: {
      id: id,
    },
  });
  //if video is existig
  if (existingcategoryvideo) {
    req.catevideo = existingcategoryvideo;
    next();
  }
  //No category video Found
  else {
    return res.status(400).json({
      error: "no category  video not found",
    });
  }
};

//this is setvideo controller
export const setvideo = async (req, res) => {
  try {
    //find admin in db
    const ADMIN = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    //if user is existing and admin

    if (ADMIN && req.user.role == 1) {
      // Check Category Does not exist
      const existingcategory = await Category.findOne({
        where: {
          id: req.category.id,
        },
      });

      //enter data in form for video

      let form = new formidable.IncomingForm();
      form.keepExtensions = true;

      //video direct set in folder
      form.uploadDir = imagepath;

      //form parse use for parseing data
      form.parse(req, async (err, fields, file) => {
        //if any error in form parse time
        console.log(err);

        if (existingcategory) {
          //if category is existing so create video
          const {
            categoryname,
            videotitle,
            videodescription,
            videotime,
            video,
          } = fields;

          //video save with currunt unique time
          const videos =
            new Date().getTime() + "--" + file.video.originalFilename;

          //this is for our folder in save video
          const fileName =
            "\\" + new Date().getTime() + "--" + file.video.originalFilename;
          console.log(videos);

          //actualpath
          const actualpath = file.video.filepath;

          //real path
          const mainfilepath = path.join(imagepath, fileName);

          //convert actual path to real path
          fs.rename(actualpath, mainfilepath, (err) => {
            //error in rename path
            if (err) console.log(err);
            //if success in rename path
            else {
              console.log("file rename successfully");
            }
          });

          //this is for our db

          //this two detail is already from another table
          const id = req.category.id;
          const catename = req.category.categoryname;

          //create catevideo
          const createcategoryvideo = await Catevideo.create({
            categoryname: catename,
            videotitle: videotitle,
            videodescription: videodescription,
            videotime: videotime,
            video: videos,
            cateid: id,
          });

          console.log(fields);

          //response
          res.status(201).json({ createcategoryvideo });
        }

        //catevideo is not created
        else {
          return res.status(400).json({
            messages: "catevideo is not created",
          });
        }
      });
      //You Are not Admin or not existing category
    } else {
      return res.status(400).json({
        messages: "You Are not Admin or not existing category",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//this is getvideo controller
export const getvideo = async (req, res) => {
  try {
    //find user by id
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    //find category by id
    const find = await Category.findOne({
      where: {
        id: req.category.id,
      },
    });
    //find catevideo by id
    const findall = await Catevideo.findAll({
      where: {
        categoryname: req.body.categoryname,
      },
    });
    //if user and find opration successfully
    if (user && find) {
      res.status(400).json(findall);
    }
    //You Are not User or Not Existing Category
    else {
      return res.status(400).json({
        messages: "You Are not User or Not Existing Category",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//this is update video controller
export const updatevideo = async (req, res) => {
  try {
    //update video only by admin aand admin check by his role
    if (req.user.role == 1) {
      //this is form for data update
      let form = new formidable.IncomingForm();
      form.keepExtensions = true;
      form.uploadDir = imagepath;
      //form parse
      form.parse(req, async (err, fields, file) => {
        //if err in image set
        if (err) {
          console.log(err);
          return res.status(400).json({
            error: "problem with image",
          });
        }

        //destructure

        const { videotitle, videodescription, videotime } = fields;
        console.log(fields);
        //update only three thing not include video
        const updatedRow = await Catevideo.update(
          {
            videotitle: videotitle,
            videodescription: videodescription,
            videotime: videotime,
          },
          {
            where: {
              id: req.catevideo.id,
            },
          }
        );
        //if find file.video.originalfilename
        if (file && file.video && file.video.originalFilename) {
          const filevideo = file.video.originalFilename;

          //filename save in folder
          const fileName =
            "\\" + new Date().getTime() + "--" + file.video.originalFilename;

          //this is path save in our db
          const videos =
            new Date().getTime() + "--" + file.video.originalFilename;

          console.log(videos);

          //this is over actual path
          const actualpath = file.video.filepath;

          //  this is main path
          const mainfilepath = path.join(imagepath, fileName);
          fs.rename(actualpath, mainfilepath, (err) => {
            if (err) console.log(err);
            else {
              console.log("file rename successfully");
            }
          });

          //reqfor video
          const upfilenames = req.catevideo.video;

          //join path for unlink file
          const mainupfile = path.join(
            `/fitnessproject/public/videos/`,
            upfilenames
          );
          console.log({ upfilenames, mainupfile });

          //fs unlink old data

          fs.unlink(mainupfile, (err) => {
            //if unlink in err
            if (err) console.log(err);
            //if unlink successfully
            else {
              console.log("deleted video successfully");
            }
          });

          //this uvideo save in db
          const uvideo =
            new Date().getTime() + "--" + file.video.originalFilename;

          //updation for video
          const updatedRow2 = await Catevideo.update(
            {
              video: uvideo,
            },
            {
              where: {
                id: req.catevideo.id,
              },
            }
          );
          //clg for update row
          console.log(updatedRow2);
        }
        //Category video details Updated successfully
        return res.status(200).json({
          messages: "Category video details Updated successfully",
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

export const deletevideo = async (req, res) => {
  try {
    //this is for original path of video
    const upfilenames = req.catevideo.video;

    //if only admin delete video
    if (req.user.role == 1) {
      //mainuppath for store in file folder
      const mainupfile = path.join(
        `/fitnessproject/public/videos/`,
        upfilenames
      );

      //file unlink from folder
      fs.unlink(mainupfile, (err) => {
        //unlink in error
        if (err) console.log(err);
        //unlink success fully
        else {
          console.log("deleted Video successfully");
        }
      });

      //for delete row
      const deletedRow = await Catevideo.destroy({
        where: {
          id: req.catevideo.id,
        },
      });
      console.log(deletedRow);

      //if successfully deleted row

      if (deletedRow) {
        res.status(200).json({
          messages: "Deleted row successfully",
        });
      }
      //any problem in row delete time
      else {
        return res.status(400).json({
          messages: "Not row Deleted",
        });
      }

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
