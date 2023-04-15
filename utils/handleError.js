const resErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    console.error("出現重大錯誤", err);
    res
      .status(500)
      .json({ status: "error", message: "系統錯誤，請洽系統管理員" });
  }
};

const resErrDev = (err, res) => {
  res.status(err.statusCode).json({ status: "error", error: err });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV) {
    return resErrProd(err, res);
  }
  if (err.name === "Validation Error") {
    err.message = "資料欄位未填寫正確，請重新輸入!!";
    err.isOperational = true;
  }
  resErrDev(err, res);
};
