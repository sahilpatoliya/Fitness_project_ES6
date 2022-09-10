// import db from "../../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {
  sendError,
  sendSuccess,
  sendBadRequest,
} from "../../utilities/response.js";
import messages from "../../utilities/messages.js";
import db from "../../models/index.js";
//db.user = user(sequelize);
const Token = db.token;
const User = db.user;
/**
 * Register User
 * @param req
 * @param res
 */

//registerUser Controller

export const getuserbyToken = async (req, res, next, token) => {
  //Find Token of User
  const existinguser = await Token.findOne({
    where: {
      token: token,
    },
  });
  //if this is user so gonig to next
  if (existinguser) {
    req.token = existinguser;
    next();
  }
  //  if not user user not found
  else {
    return res.status(400).json({
      error: "no user found",
    });
  }
};

//genrate token controller

export const genratetoken = async (req, res) => {
  try {
    //Find by email of User

    const user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    //if not user
    if (!user) {
      return res.status(400).send("user with given email doesn't exist");
    }

    //find by email user token already create or not

    let token = await Token.findOne({ where: { email: user.email } });
    console.log(token);
    if (!token) {
      //if not token genrate any time to create new token
      let token = await new Token({
        email: user.email,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      //create unique link for password reset

      const link = `${process.env.BASE_URL}/password-reset/${user.email}/${token.token}`;
      console.log(link);

      //password reset link sent to your email account
      res.status(200).json({
        messages: "password reset link sent to your email account",
      });
      //password reset link  is already sent to your email account
    } else {
      res.status(200).json({
        messages: "password reset link  is already sent to your email account",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

//Reset Password concept

export const resetpassword = async (req, res, uuid) => {
  //this hash for user enter password to dcrypt password

  const hash = bcrypt.hashSync(req.body.password, 10);

  //try for run controller

  try {
    //if user is verify account first so change password
    if (req.user.status == 1) {
      //find by uuid
      if ((uuid = req.user.uuid)) {
        //if find and update
        const updatedRow = await User.update(
          {
            enc_password: hash,
          },
          {
            where: {
              uuid: req.user.uuid,
            },
          }
        );
        console.log(updatedRow);
        //if row is updated success fully so token is deleted
        if (updatedRow) {
          //token delete

          const deleteRow = await Token.destroy({
            where: {
              email: req.user.email,
            },
          });
          console.log("deleted", deleteRow);

          //your password is updated success fully
          res.status(200).json({
            messages: "Your Password Updated SuccessFully",
          });
          //Your Password Not Updated
        } else {
          return res.status(400).json({
            messages: "Your Password Not Updated",
          });
        }
        //Your email is not Existing
      } else {
        return res.status(400).json({
          messages: "Your email is not Existing",
        });
      }
      //Sign Up First Or Verify Account
    } else {
      return res.status(400).json({
        messages: "Sign Up First Or Verify Account",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};
