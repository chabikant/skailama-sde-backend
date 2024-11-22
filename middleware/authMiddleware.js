const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.body.userId = decoded.id;
    next();
    return;
  } catch (err) {
    res.status(401).send({ success: false, message: "Invalid Token" });
  }
};
