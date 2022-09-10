import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
//import socket from "socket.io";
const app = express();
import routes from "./routes/index.js";
app.use(cors());

// DB Connection
import db from "./models/index.js";
db.sequelize
  .sync()
  .then(() => {
    //success fully synced db
    console.log("Synced db.");
  })
  .catch((err) => {
    //not connect db
    console.log("Failed to sync db: ");
  });

// Route handel

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//check route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

app.use("/api", routes);

// import app from "./routes/user/user.routes.js";

// set port, listen for requests
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// access public folder
app.use(express.static("public"));

export default app;
