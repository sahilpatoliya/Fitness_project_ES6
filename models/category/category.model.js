import Sequelize from "sequelize";

export default (sequelize) => {
  //category table
  return sequelize.define("category", {
    categoryname: {
      type: Sequelize.STRING,
      require: true,
    },
    description: {
      type: Sequelize.STRING,
      require: true,
    },
    photo: {
      type: Sequelize.STRING,
      require: true,
    },
  });
};
