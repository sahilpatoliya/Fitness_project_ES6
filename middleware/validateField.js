import { validationResult } from "express-validator";
import { sendError } from "../utilities/response.js";
import messages from "../utilities/messages.js";

//for validation field
const validateField = (req, res, next) => {
  const errors = validationResult(req);
  //if user not enter any details
  if (!errors.isEmpty()) {
    return sendError(res, errors.array(), messages.fieldMissingError);
  }
  //successfully pass by this middleware
  next();
};

export default validateField;
