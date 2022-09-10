import db from "../../models/index.js";
const User = db.user;
const Userdetail = db.userdetail;
const Product = db.product;
import { validationResult } from "express-validator";
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

//userdetail Controller

//getuserdetailby id controller
export const getuserdetailbyId = async (req, res, next, id) => {
  //Find userdetail AND Send Unique Link
  const existinguserdetail = await Userdetail.findOne({
    where: {
      id: id,
    },
  });
  //If  userdetail is existing or not Check
  if (existinguserdetail) {
    req.userdetail = existinguserdetail;
    next();
  }
  //No userdetail Found
  else {
    return res.status(400).json({
      error: "no userdetail found",
    });
  }
};

//setuserdetail
export const setuserdetail = async (req, res) => {
  try {
    //find by id user

    const existinguser = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    //first check token time id and added id is match
    if (existinguser) {
      const userDetail = await Userdetail.findOne({
        where: {
          email: req.auth.email,
        },
      });

      //two details from user table
      const usersdetail = {
        userid: req.user.id,
        email: req.user.email,
      };

      //check this id is already existing or not
      if (req.user.email == req.auth.email) {
        //two property is from user table

        //create userdetail table
        //console.log(userDetail);
        if (userDetail === null) {
          const setuserdetail = await Userdetail.create(usersdetail);
          //success
          if (setuserdetail) {
            res.status(200).json({
              messages: "Userdetail is set success fully ",
            });
          }
          //erroe
          else {
            return res.status(400).json({
              messages: "not set detail ",
            });
          }
          //   }
        }
        //  already detail set
        else {
          return res.status(400).json({
            messages: "Userdetail is already set detail ",
          });
        }
        //user detail not matched
      } else {
        return res.status(400).json({
          messages: "user detail not matched",
        });
      }
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//updatedetail
export const updateuserdetail = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions

  //this is validation for this detail is proper or not
  let step = req.body.step;
  let calories = req.body.calories;
  let sleep = req.body.sleep;
  let heartrate = req.body.heartrate;
  let temperature = req.body.temperature;
  let weight = req.body.weight;
  let bloodpressure = req.body.bloodpressure;
  let oxygen = req.body.oxygen;

  //if not send bad request
  if (
    !calories &&
    !step &&
    !sleep &&
    !heartrate &&
    !temperature &&
    !weight &&
    !bloodpressure &&
    !oxygen
  ) {
    //please include valid feilds
    return res.status(400).json({ msg: "please include valid feilds" });
  }

  console.log(req.params.userid, req.userdetail.id);
  try {
    //only admin change detail
    if (req.user.role == 1) {
      const userDetail = await Userdetail.findOne({
        where: {
          id: req.userdetail.id,
        },
      });
      console.log(userDetail);
      if (userDetail) {
        //update row

        const updatedRow = await Userdetail.update(
          req.body,

          {
            where: {
              //update by id
              id: req.userdetail.id,
            },
          }
        );
        //updated row successfully

        if (updatedRow) {
          res.status(200).json({
            messages: "updated Row Successfully",
          });
        }
        //Row not updated
        else {
          return res.status(400).json({
            messages: "Row not updated",
          });
        }
      }
      //You userdetailuuid is not matched
      else {
        return res.status(400).json({
          messages: "You userdetailuuid is not matched",
        });
      }
    }
    // // /You are not an Admin
    else {
      return res.status(400).json({
        messages: "You are not an Admin",
      });
    }
    // catch for find error
  } catch (error) {
    console.log(error);
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//deletedetails
export const deletedetail = async (req, res) => {
  try {
    // only admin delete any detail of user
    if (req.user.role == 1) {
      const deletedRow = await Userdetail.destroy({
        where: {
          //delete by id
          id: req.userdetail.id,
        },
      });

      //if successfully deleted row
      if (deletedRow) {
        res.status(200).json({
          messages: "Deleted row Success fully",
        });
      }
      //not detail row deleted
      else {
        return res.status(400).json({
          messages: "not deleted row",
        });
      }
    }
    //You Are Not Admin
    else {
      return res.status(400).json({
        messages: "You are not an Admin",
      });
    }
    // catch for find error
  } catch (error) {
    console.log(error);
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//this is for admin only
export const getdetailbyadmin = async (req, res) => {
  try {
    //you are admin
    if (req.user.role == 1) {
      //find Userdetail by id
      const find = await Userdetail.findOne({
        where: {
          id: req.userdetail.id,
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
    console.log(error);
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//this is for user
export const getuserdetail = async (req, res) => {
  try {
    //find by id user or not
    const existinguser = await User.findOne({
      where: {
        //find by id
        id: req.user.id,
      },
    });
    //if existing so call next step
    if (existinguser) {
      //find in product
      const prodectid = await Product.findOne({
        where: {
          //find and compare modelid by auth modelid
          modelid: req.auth.modelid,
        },
      });
      //if matched then so him his detail
      if (prodectid) {
        //then next step find by userdetail id to user detail
        const userdetails = await Userdetail.findOne({
          where: {
            userid: req.params.id,
          },
        });
        //you get product to find
        if (userdetails) {
          res.json(userdetails);
        }
        //not find by userdetail
        else {
          return res.status(400).json({
            messages: "Your userdetail id is not matched",
          });
        }
      }
      // if not match model
      else {
        return res.status(400).json({
          messages: "Your Modelid is not matched",
        });
      }
    }
    //you are not user or incorrect detail
    else {
      return res.status(400).json({
        messages: "You are not user",
      });
    }
    // catch for find error
  } catch (error) {
    console.log(error);
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};
