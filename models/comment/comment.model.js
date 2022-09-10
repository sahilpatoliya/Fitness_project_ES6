import Sequelize from "sequelize";

//this is table for comment
export default (sequelize) => {
  return sequelize.define("comment", {
    comment: {
      type: Sequelize.STRING,
      require: true,
    },
    userid: {
      type: Sequelize.STRING,
    },
    categoryid: {
      type: Sequelize.STRING,
    },
    videoid: {
      type: Sequelize.STRING,
    },
  });
};
