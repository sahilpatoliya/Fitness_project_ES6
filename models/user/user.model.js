import bcrypt from "bcrypt";
import moment from "moment";
import Sequelize from "sequelize";

//convert our time in min
const minute = 1000 * 60;
//genrate date for specify time
const d = new Date();
//create time to user create account
let createtime = Math.round(d.getTime() / minute);

export default (sequelize) => {
  //Create User Table
  return sequelize.define(
    "user",
    {
      //email
      email: {
        type: Sequelize.STRING,
        require: true,
      },

      //this is for db only but user enter password
      enc_password: {
        type: Sequelize.STRING,
        require: true,
      },
      //enum in status
      status: {
        type: Sequelize.INTEGER,
        enum: [0, 1, 2], // 0 => Create new User, 2=> Email Verify but user info not added, 3=> Complete Registration
        defaultValue: 0,
      },
      //uuid for user
      uuid: {
        type: Sequelize.STRING,
        //default value is 16 word random string
        defaultValue: function generateString() {
          // declare all characters
          const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          let result = "";
          const charactersLength = characters.length;
          for (let i = 0; i < 16; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }

          return result;
        },
      },

      //createtime for user
      createtime: {
        type: Sequelize.INTEGER,
        defaultValue: createtime,
      },
      //role for admin
      role: {
        type: Sequelize.INTEGER,
        enum: [0, 1], // 0 => user 1=> admin
        defaultValue: 0,
      },
    },

    {
      //hooks cocept for our user enter simple password and we are save db in enc_password
      hooks: {
        beforeCreate: (user, options) => {
          {
            user.enc_password =
              user.enc_password && user.enc_password !== ""
                ? bcrypt.hashSync(user.enc_password, 10)
                : "";
          }
        },
      },
    },
    console.log(moment().format("MMMM Do YYYY, h:mm:ss a")),
    { timestamps: true }
  );
};
