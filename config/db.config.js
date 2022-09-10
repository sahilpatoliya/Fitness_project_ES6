export default {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "9978923484",
  DB: "fitness",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
