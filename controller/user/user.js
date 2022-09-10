// import db from "../../models";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  sendError,
  sendSuccess,
  sendBadRequest,
} from "../../utilities/response.js";
import messages from "../../utilities/messages.js";
import db from "../../models/index.js";
//db.user = user(sequelize);
const User = db.user;
/**
 * Register User
 * @param req
 * @param res
 */

//registerUser Controller

export const registerUser = async (req, res) => {
  try {
    //find by email user is existing or not

    const existingUser = await User.findOne({
      where: {
        //find by body
        email: req.body.email,
      },
    });

    // User if already exist
    if (!existingUser) {
      const user = {
        email: req.body.email,
        enc_password: req.body.password,
      };

      // Save Tutorial in the database
      const registerUser = await User.create(user);
      // Create a token
      console.log(registerUser);
      //token genrate base on email id and uuid
      const token = jwt.sign(
        {
          email: registerUser.email,
          id: registerUser.id,
          uuid: registerUser.uuid,
        },
        process.env.JWT_ACC,
        {
          //token expiresInis 24h
          expiresIn: "24h",
        }
      );
      if (registerUser) {
        sendSuccess(res, token, registerUser);
      } else {
        return res.status(400).json({
          messages: "User not Register ",
        });
      }
    }
    //add email and password
    else {
      return sendBadRequest(res, messages.userAlreadyExist);
    }
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, err, messages.error);
  }
};
//get User by id
export const getUserById = async (req, res, next, id) => {
  try {
    //Find User AND Send Unique Link
    const existingUser = await User.findOne({
      where: {
        id: id,
      },
    });
    //If  User is existing
    if (existingUser) {
      req.user = existingUser;
      next();
    }
    //No User Found
    else {
      return res.status(400).json({
        error: "no user found",
      });
    }
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, err, messages.error);
  }
};
//get User by uuid
export const getUserByUuid = async (req, res, next, uuid) => {
  try {
    const existingUser = await User.findOne({
      where: {
        uuid: uuid,
      },
    });
    //If  User is existing
    if (existingUser) {
      req.user = existingUser;
      next();
    }
    //No User Found
    else {
      return res.status(400).json({
        error: "no user found",
      });
    }
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, err, messages.error);
  }
};
//User verification
export const verification = async (req, res) => {
  try {
    //if User Is Already Verifyed
    if (req.user.status == 1) {
      res.status(400).json({
        messages: "user is already verifyed",
      });
    }
    //if not verified so Give Verification
    else {
      //Convert time in min
      const cmin = 1000 * 60;
      const ct = new Date();
      //this is for current create time
      let currentTime = Math.round(ct.getTime() / cmin);
      //this is for past time
      let pastTime = req.user.createtime;

      //  Check Diffrence Between Current Time And Pasttime

      let difference = currentTime - pastTime;
      console.log(difference);

      //Update Status

      const updatedRow = await User.update(
        {
          status: 1,
          createtime: difference,
        },
        {
          // update by unique id

          where: {
            uuid: req.user.uuid,
          },
        }
      );
      console.log(updatedRow);
      //Your Link time is over
      //min time is 30 minute
      if (difference > 30) {
        res.status(400).json({
          messages: "Your Link Time is Over",
        });
      }

      // User Successfully Verifyed
      else {
        return res.status(200).json({
          messages: "user is successfully verified",
        });
      }
    }
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, err, messages.error);
  }
};
//User get link back
//Your unique Link is Expire so call this api
export const resendUniqueId = async (req, res) => {
  try {
    let token = req.headers["authorization"];

    let token1 = String(token).split(" ")[1]; // access token

    //successfully find token

    if (token1) {
      jwt.verify(
        token1,
        process.env.JWT_ACC,
        async function (err, decodedtoken) {
          //incorrect or expired token

          if (err) {
            return res.status(400).json({ err: "incorrect or expired token" });
          }

          // if not error so Decode token and find email

          const existingUser = await User.findOne({
            where: { email: decodedtoken.email },
          });

          //Create Random string

          if (existingUser) {
            const cmin = 1000 * 60;
            const ct = new Date();
            let newcurrentTime = Math.round(ct.getTime() / cmin);
            function generateString() {
              const characters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let result = "";
              const charactersLength = characters.length;
              //random string of 16
              for (let i = 0; i < 16; i++) {
                result += characters.charAt(
                  Math.floor(Math.random() * charactersLength)
                );
              }

              return result;
            }

            //update detail based on random string

            const updatedRow = await User.update(
              //update status , createtime and uuid
              {
                status: 0,
                createtime: newcurrentTime,
                uuid: generateString(),
              },
              {
                //where find by email
                where: {
                  email: existingUser.email,
                },
              }
            );
            //update row successfully
            if (updatedRow) {
              res
                .status(200)
                .json({ err: "Your link is created successfully" });
            }
            //update row successfully or not
            else {
              res
                .status(400)
                .json({ err: "Your link not created successfully" });
            }
          }
        }
      );
    }
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, err, messages.error);
  }
};

//user sign in
export const signin = async (req, res) => {
  //user add email and password
  const { email, password } = req.body;

  try {
    //find by email in db
    const existinguser = await User.findOne({
      where: {
        email: email,
      },
    });

    //if this is not User
    if (!existinguser) {
      return res
        .status(400)
        .json({ err: "Please try to login with correct login credentials" });
    }

    //decrypt our enc_password

    const result = bcrypt.compareSync(password, existinguser.enc_password);
    //Login Successfully
    if (result) {
      res.status(200).json({ success: true, msg: "Login Successfully" });
    }
    //Please try to login with correct login credentials
    else {
      return res
        .status(400)
        .json({ err: "Please try to login with correct login credentials" });
    }
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};
