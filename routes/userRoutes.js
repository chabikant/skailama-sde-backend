const express = require("express");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", async (request, response) => {
  try {
    const user = await User.findOne({ email: request.body.email });

    if (user) {
      response.status(409).send({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);

    const newUser = new User({
      userName: request.body.userName,
      email: request.body.email,
      password: hashedPassword,
    });
    await newUser.save();

    response
      .status(201)
      .send({ success: true, message: "User Created ! Please Login" });
  } catch (err) {
    response
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
    console.log(err.message);
  }
});

router.post("/login", async (request, response) => {
  try {
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
      response
        .status(404)
        .send({ success: false, message: "No User Exists !! Please SignUp" });
      return;
    }

    const validPassword = await bcrypt.compare(
      request.body.password,
      user.password
    );

    if (!validPassword) {
      response.status(401).send({
        success: false,
        message: "Invalid Credentails",
      });
      return;
    }

    const jwtToken = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_KEY
    );

    response.status(200).send({
      success: true,
      message: "User Logged in",
      data: jwtToken,
    });
    return;
  } catch (err) {
    console.log(err.message);
    response.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/get-user", authMiddleware, async (request, response) => {
  try {
    const user = await User.findOne({ _id: request.body.userId });

    if (!user) {
      response.status(404).send({
        success: false,
        message: "User not found",
        data: {},
      });
      return;
    }

    response.status(200).send({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (error) {
    console.log(err.message);
    response.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.put("/edit-user", authMiddleware, async (request, response) => {
  try {
    const user = await User.findOne({ _id: request.body.userId });

    if (!user) {
      response.status(404).send({
        success: false,
        message: "User not found",
        data: {},
      });
      return;
    }

    user.userName = request.query.userName;

    await user.save();

    response.status(200).send({
      success: true,
      message: "User found",
      data: user,
    });

    return;
  } catch (error) {
    console.log(err.message);
    response.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
});


module.exports = router;
