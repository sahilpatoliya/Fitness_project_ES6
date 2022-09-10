import db from "../../models/index.js";
const User = db.user;
const Category = db.category;
const Catevideo = db.catevideo;
const Comment = db.comment;
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

//comment Controller

//getcommentbyid controller
export const getcommentByid = async (req, res, next, id) => {
  //Find comment AND Send id
  const existingcomment = await Comment.findOne({
    where: {
      id: id,
    },
  });
  //If  comment is existing or not Check
  if (existingcomment) {
    req.comment = existingcomment;
    next();
  }
  //No comment Found
  else {
    return res.status(400).json({
      error: "no comment found",
    });
  }
};

//this is set comment controller
export const setcomment = async (req, res) => {
  try {
    //find by user id user is valid or not
    const existingUser = await User.findOne({
      where: {
        //by id param
        id: req.user.id,
      },
    });
    //if user is valid
    if (existingUser) {
      //set comment and id set by id
      const comment = {
        comment: req.body.comment,
        //by userid param
        userid: req.user.id,
        //by category id param
        categoryid: req.category.id,
        //by catevideo id param
        videoid: req.catevideo.id,
      };

      //create comment in db
      const setcomment = await Comment.create(comment);

      //set comment in db successfully
      if (setcomment) {
        return res.status(200).json({
          messages: "comment set successfully",
        });
      }
      //comment not set by some issue
      else {
        return res.status(400).json({
          messages: "comment not set ",
        });
      }
    }
    //you are not user signup first
    else {
      return res.status(400).json({
        messages: "You Are not User",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};
