import db from "../../models/index.js";
const User = db.user;
const Userdetail = db.userdetail;
const Product = db.product;
import { Op } from "sequelize";
import { validationResult } from "express-validator";
import {
  sendError,
  sendSuccess,
  sendBadRequest,
} from "../../utilities/response.js";
import messages from "../../utilities/messages.js";
import { DATE } from "sequelize";
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
    const bodyDate = new Date(req.body.date);
    console.log(bodyDate);
    //find by id user

    // this is for check the date
    const createtime = new Date();

    //find by id
    const userDetail = await Userdetail.findOne({
      where: {
        userid: req.auth.id,
      },
    });
    //this is validation for this detail is proper or not
    let step = req.body.data.step;

    let calories = req.body.data.calories;
    let sleep = req.body.data.sleep;
    let heartrate = req.body.data.heartrate;
    let temperature = req.body.data.temperature;
    let weight = req.body.data.weight;
    let bloodpressure = req.body.data.bloodpressure;
    let oxygen = req.body.data.oxygen;

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

    const existinguser = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    //first check token time id and added id is match
    if (existinguser) {
      //console.log(userDetaildate);
      console.log(createtime == bodyDate);
      //two details from user table
      const usersdetail = {
        userid: req.user.id,
        email: req.user.email,
      };

      // //check this id is already existing or not
      if (req.user.id == req.auth.id) {
        //check by user detail this is already exist or not
        if (userDetail === null && createtime == bodyDate) {
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
        }
        //  already detail set
        else {
          //update row

          // if date and data is existing so update the row
          const updatedRow = await Userdetail.update(req.body.data, {
            where: {
              //update by id
              userid: req.auth.id,
            },
          });
          console.log(req.body.data);

          console.log(updatedRow);

          //updated detail successfully
          if (updatedRow) {
            res.status(200).json({
              messages: "Userdetail is updated successfully",
            });
          }
          //erroe
          else {
            return res.status(400).json({
              messages: "not updated detail ",
            });
          }
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
        const userdetails = await Userdetail.findAll({
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

export const getdatebydetail = async (req, res) => {
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
        //then next step find by userdetail date to user detail
        const userdetails = await Userdetail.findOne({
          where: {
            date: req.body.date,
          },
        });
        //you get product to find
        console.log(userdetails);
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

export const getdatetodate = async (req, res) => {
  try {
    //  find all for find date between
    const userdetails = await Userdetail.findAll({
      where: {
        // find by id
        userid: req.params.id,
      },
    });

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
      //find date satrt date
      const startDate = new Date(req.body.startdate);

      //end date to find between
      const endDate = new Date(req.body.enddate);
      console.log("Start date ", startDate, "EndDate ", endDate);

      //array for data add
      let datesArray = [];

      //  if modelid is matched
      if (prodectid) {
        //findall opration perform
        const userdetailss = await Userdetail.findAll({
          where: {
            //userid by params
            userid: req.params.id,
            //startdate and end date between
            date: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
        // console.log(userdetailss[0]);

        //this is for all details save in this array
        const stepArray = [];
        const caloriesArray = [];
        const sleepArray = [];
        const heartrateArray = [];
        const temperatureArray = [];
        const weightArray = [];
        const bloodpressureArray = [];
        const oxygenArray = [];

        //map for all details
        userdetailss.map((data) => {
          //then find data and data push
          stepArray.push(data.step);
        });

        userdetailss.map((data) => {
          caloriesArray.push(data.calories);
        });

        userdetailss.map((data) => {
          sleepArray.push(data.sleep);
        });

        userdetailss.map((data) => {
          heartrateArray.push(data.heartrate);
        });

        userdetailss.map((data) => {
          temperatureArray.push(data.temperature);
        });

        userdetailss.map((data) => {
          weightArray.push(data.weight);
        });

        userdetailss.map((data) => {
          bloodpressureArray.push(data.bloodpressure);
        });

        userdetailss.map((data) => {
          oxygenArray.push(data.oxygen);
        });

        //reduce for all details +
        const sum = stepArray.reduce((a, b) => a + b, 0);
        const sum1 = caloriesArray.reduce((a, b) => a + b, 0);
        const sum2 = sleepArray.reduce((a, b) => a + b, 0);
        const sum3 = heartrateArray.reduce((a, b) => a + b, 0);
        const sum4 = temperatureArray.reduce((a, b) => a + b, 0);
        const sum5 = weightArray.reduce((a, b) => a + b, 0);
        const sum6 = bloodpressureArray.reduce((a, b) => a + b, 0);
        const sum7 = oxygenArray.reduce((a, b) => a + b, 0);

        console.log(sum);

        const response = {
          stpes: `${sum}`,
          calories: `${sum1}`,
          sleep: `${sum2}`,
          heartrate: `${sum3}`,
          temperature: ` ${sum4}`,
          weight: `${sum5}`,
          bloodpressure: `${sum6}`,
          oxygen: `${sum7}`,
        };

        //then all data show
        res.status(200).json(response);
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
    //  catch for find error
  } catch (error) {
    // console.log(error);
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};

export const avragedata = async (req, res) => {
  try {
    //  find all for find date between
    const userdetails = await Userdetail.findAll({
      where: {
        // find by id
        userid: req.params.id,
      },
    });

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
      const startDate = new Date(req.body.startdate);
      const endDate = new Date(req.body.enddate);
      console.log("Start date ", startDate, "EndDate ", endDate);
      if (prodectid) {
        const userdetailss = await Userdetail.findAll({
          where: {
            //userid by params
            userid: req.params.id,
            //startdate and end date between
            date: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
        //this is for all details save in this array
        const stepArray = [];
        const caloriesArray = [];
        const sleepArray = [];
        const heartrateArray = [];
        const temperatureArray = [];
        const weightArray = [];
        const bloodpressureArray = [];
        const oxygenArray = [];

        //map for all details
        userdetailss.map((data) => {
          //then find data and data push
          stepArray.push(data.step);
        });

        userdetailss.map((data) => {
          caloriesArray.push(data.calories);
        });

        userdetailss.map((data) => {
          sleepArray.push(data.sleep);
        });

        userdetailss.map((data) => {
          heartrateArray.push(data.heartrate);
        });

        userdetailss.map((data) => {
          temperatureArray.push(data.temperature);
        });

        userdetailss.map((data) => {
          weightArray.push(data.weight);
        });

        userdetailss.map((data) => {
          bloodpressureArray.push(data.bloodpressure);
        });

        userdetailss.map((data) => {
          oxygenArray.push(data.oxygen);
        });

        //reduce for all details +
        const sum = stepArray.reduce((a, b) => a + b, 0);
        const sum1 = caloriesArray.reduce((a, b) => a + b, 0);
        const sum2 = sleepArray.reduce((a, b) => a + b, 0);
        const sum3 = heartrateArray.reduce((a, b) => a + b, 0);
        const sum4 = temperatureArray.reduce((a, b) => a + b, 0);
        const sum5 = weightArray.reduce((a, b) => a + b, 0);
        const sum6 = bloodpressureArray.reduce((a, b) => a + b, 0);
        const sum7 = oxygenArray.reduce((a, b) => a + b, 0);

        //this is for particular data define
        let steps = `${sum / 7} step`;
        let calories = `${sum1 / 7} BPW`;
        let sleep = `${sum2 / 7} Hours`;
        let heartrate = `${sum3 / 7} RPW`;
        let temperature = `${sum4 / 7} .C`;
        let weight = `${sum5 / 7} KG`;
        let bloodpressure = `${sum6 / 7} BP`;
        let oxygen = `${sum7 / 7} O2`;

        //all response
        const response = {
          stpes: steps,
          calories: calories,
          sleep: sleep,
          heartrate: heartrate,
          temperature: temperature,
          weight: weight,
          bloodpressure: bloodpressure,
          oxygen: oxygen,
        };

        //this is for query is empty
        let data = "";
        if (req.query.data) {
          data = req.query.data;
        }

        //switch case for data
        switch (data) {
          //case for step
          case "step":
            res.status(200).json({
              messages: `Per Day Step is :-> ${steps}`,
            });
            break;

          //  case for calories
          case "calories":
            res.status(200).json({
              messages: `Per Day Calories is :-> ${calories}`,
            });
            break;

          //case fro sleep
          case "sleep":
            res.status(200).json({
              messages: `Per Day sleep is :-> ${sleep}`,
            });
            break;

          //case for heartrate
          case "heartrate":
            res.status(200).json({
              messages: `Per Day heartrate is :-> ${heartrate}`,
            });
            break;

          //case fro temprature
          case "temperature":
            res.status(200).json({
              messages: `Per Day temperature is :-> ${temperature}`,
            });
            break;

          //case for weight
          case "weight":
            res.status(200).json({
              messages: `avrage weight is :-> ${weight}`,
            });
            break;

          // case for bloodpressure
          case "bloodpressure":
            res.status(200).json({
              messages: `avrage bloodpressure is :-> ${bloodpressure}`,
            });
            break;

          //case for oxygen
          case "oxygen":
            res.status(200).json({
              messages: `avrage oxygen is :-> ${oxygen}`,
            });
            break;

          //default all data show
          default:
            //then all data show
            res.status(200).json(response);
            console.log(response);
            break;
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
    //  catch for find error
  } catch (error) {
    // console.log(error);
    // if any error in start program so call catch
    return sendError(res, messages.error);
  }
};
