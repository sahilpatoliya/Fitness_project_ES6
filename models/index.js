import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";

// Connect TO DB
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// Create DB Object
const db = {};
db.Sequelize = Sequelize; // Library reference
db.sequelize = sequelize; // Connection DB reference

// Connect User Table with DB
import user from "./user/user.model.js";
db.user = user(sequelize);

//connect Token table with db
import token from "./token/token.model.js";
db.token = token(sequelize);

//connect Token table with db
import profile from "./profile/profile.model.js";
db.profile = profile(sequelize);

//connect Category table with db
import category from "./category/category.model.js";
db.category = category(sequelize);

//connect category video with db
import catevideo from "./catevideo/catevideo.model.js";
db.catevideo = catevideo(sequelize);

//connect db for comment
import comment from "./comment/comment.model.js";
db.comment = comment(sequelize);

//connect product table to db
import product from "./product/product.model.js";
db.product = product(sequelize);

//connect userdetail in db
import userdetail from "./userdetail/userdetail.model.js";
db.userdetail = userdetail(sequelize);

// Export DB Reference
export default db;
