//for success message
export const sendSuccess = (res, token, message) => {
  return res.status(200).send({
    token,
    message,
    code: 200,
  });
};
//success with date

export const sendSuccessWithDate = (res, data, date) => {
  res.status(200).send({
    data,
    date,
    code: 200,
  });
};
//send bad message

export const sendBadRequest = (res, messages) => {
  res.status(400).send({
    message: messages,
    code: 400,
  });
};
// send error

export const sendError = (res, errors, message) => {
  res.status(400).send({
    message,
    code: 400,
    errors,
  });
};

//export our all

// export default { sendError, sendBadRequest, sendSuccessWithDate, sendSuccess };
