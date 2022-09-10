import Sequelize from "sequelize";

export default (sequelize) => {
  //user profile table
  return sequelize.define("profile", {
    firstname: {
      type: Sequelize.STRING,
      required: true,
    },
    lastname: {
      type: Sequelize.STRING,
      required: true,
    },
    gender: {
      type: Sequelize.STRING,
      required: true,
    },
    year: {
      type: Sequelize.INTEGER,
      required: true,
    },
    height: {
      type: Sequelize.STRING,
      required: true,
    },
    weight: {
      type: Sequelize.STRING,
      required: true,
    },
    goal: {
      type: Sequelize.STRING,
      required: true,
    },
    email: {
      type: Sequelize.STRING,
      refrences: {
        model: "user",
        key: "id",
      },
    },
  });
};
