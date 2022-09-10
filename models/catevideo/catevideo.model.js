import Sequelize from "sequelize";

export default (sequelize) => {
  //category video table
  return sequelize.define("catevideo", {
    categoryname: {
      type: Sequelize.STRING,
      refrences: {
        model: "category",
        key: "cateid",
      },
    },

    videotitle: {
      type: Sequelize.STRING,
      required: true,
    },
    videodescription: {
      type: Sequelize.STRING,
      required: true,
    },
    videotime: {
      type: Sequelize.STRING,
      required: true,
    },
    video: {
      type: Sequelize.STRING,
      require: true,
    },
    cateid: {
      type: Sequelize.STRING,
      //  require: true,
    },
  });
};
