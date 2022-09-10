import db from "../../models/index.js";
const User = db.user;
const Profile = db.profile;
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

//Profile Controller
export const setprofile = async (req, res, id) => {
  try {
    // Check User Does not exist
    const existingUser = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    // User if already exist
    if (req.user.status == 1) {
      if (existingUser) {
        const profile = {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          gender: req.body.gender,
          year: req.body.year,
          height: req.body.height,
          weight: req.body.weight,
          goal: req.body.goal,
          email: req.user.email,
        };
        //updaterow
        const updatedRow = await User.update(
          {
            status: 2,
          },
          {
            // update by id

            where: {
              id: req.user.id,
            },
          }
        );
        console.log(updatedRow);
        // Save Tutorial in the database
        const setprofile = await Profile.create(profile);
        sendSuccess(res, setprofile);

        // return sendBadRequest(res, messages.userAlreadyExist);
      } else {
        res.status(400).json({
          messages: "i think You Are not User",
        });
      }
      //Sign Up First Or Verify Account
    } else {
      res.status(400).json({
        messages: "Sign Up First Or Verify Account",
      });
    }
    // catch for find error
  } catch (error) {
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};
