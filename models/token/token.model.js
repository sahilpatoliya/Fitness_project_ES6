import bcrypt from "bcrypt";
import moment from "moment";
import Sequelize from "sequelize";

export default (sequelize) => {
  //Create Token Table
  return sequelize.define("token", {
    token: {
      type: Sequelize.STRING,
      required: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      default: Date.now,
      expires: 3600,
    },
    email: {
      type: Sequelize.STRING,
      required: true,
      refrences: {
        model: "user",
        key: "email",
      },
    },
  });
};
