//export user
export {
  registerUser,
  getUserById,
  getUserByUuid,
  verification,
  resendUniqueId,
  signin,
} from "./user/user.js";

//export token
export { getuserbyToken, genratetoken, resetpassword } from "./token/token.js";

//export profile
export { setprofile } from "./profile/profile.js";

//export category
export {
  createcategory,
  getcategoryById,
  getcategory,
  updatecategory,
  deletecategory,
} from "./category/category.js";

//export categorybyvideo
export {
  getcatevideobyId,
  setvideo,
  getvideo,
  updatevideo,
  deletevideo,
} from "./catevideo/catevideo.js";

//export comment
export { getcommentByid, setcomment } from "./comment/comment.js";

//export product

export {
  getProductByid,
  setproduct,
  updateproduct,
  getproduct,
  deleteproduct,
} from "./product/product.js";

//export userdetail

export {
  setuserdetail,
  getuserdetailbyId,
  updateuserdetail,
  deletedetail,
  getdetailbyadmin,
  getuserdetail,
  getdatebydetail,
  getdatetodate,
  avragedata,
} from "./userdetail/userdetail.js";
