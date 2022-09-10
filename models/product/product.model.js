import Sequelize from "sequelize";

export default (sequelize) => {
  //product table
  return sequelize.define("product", {
    productname: {
      type: Sequelize.STRING,
      required: true,
    },
    modelid: {
      type: Sequelize.STRING,
      //default value is 16 word random string
      defaultValue: function generateString() {
        // declare all characters
        const characters =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < 8; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }

        return result;
      },
    },
    description: {
      type: Sequelize.STRING,
      require: true,
    },
    photo: {
      type: Sequelize.STRING,
      require: true,
    },
    token: {
      type: Sequelize.STRING,
    },
  });
};
