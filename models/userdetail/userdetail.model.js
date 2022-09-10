import Sequelize from "sequelize";
//const minute = 1000 * 60;
const a = new Date();

let createtime = a.getDate() + "-" + a.getMonth() + "-" + a.getFullYear();
console.log(createtime);
//this userdetail model

export default (sequelize) => {
  return sequelize.define("userdetail", {
    date: {
      type: Sequelize.STRING,
      defaultValue: createtime,
    },
    userid: {
      type: Sequelize.INTEGER,
    },
    step: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    calories: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    sleep: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    heartrate: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    temperature: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    weight: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    bloodpressure: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    oxygen: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    email: {
      type: Sequelize.STRING,
    },
  });
};
