import express from "express";

//this is import user route
import userRoute from "./user/user.routes.js";
import tokenRoute from "./user_token/token.routes.js";
import profileRoute from "./profile/profile.routes.js";
import categoryRoute from "./category/category.routes.js";
import catevideoRoute from "./catevideo/catevideo.routes.js";
import commentRoute from "./comment/comment.routes.js";
import productRoute from "./product/product.routes.js";
import userdetailRoute from "./userdetail/userdetail.routes.js";

//main router
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

//before any api call
router.use("/user", userRoute);
router.use("/token", tokenRoute);
router.use("/profile", profileRoute);
router.use("/category", categoryRoute);
router.use("/catevideo", catevideoRoute);
router.use("/comment", commentRoute);
router.use("/product", productRoute);
router.use("/userdetail", userdetailRoute);

export default router;
