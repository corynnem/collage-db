const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const { User } = require("../models");
const { UniqueConstraintError } = require("sequelize/lib/errors");

const usercontroller = Router();

usercontroller.get("/test", (req, res) => {
  res.json({
    message: "test endpoint successful!",
  });
});

usercontroller.post("/register", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  try {
    let signingUp = await User.create({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 12),
    });

    if (signingUp) {
      const token = jwt.sign({ id: signingUp.id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });
      console.log(token);
      if (token) {
        res.status(201).json({
          message: "user registered",
          token,
        });
      }
    }
  } catch (e) {
    if (e instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "email already in use",
      });
    } else {
      res.status(500).json({
        message: "failed to register user",
      });
    }
  }
});

usercontroller.post("/login", async (req, res) => {
  let { email, password } = req.body;

  try {
    let loggingIn = await User.findOne({
      where: {
        email,
      },
    });
    if (loggingIn && (await bcrypt.compare(password, loggingIn.password))) {
      const token = jwt.sign({ id: loggingIn.id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
      });
      if (token) {
        res.status(200).json({
          message: "login success",
          token,
        });
      }
    } else {
      res.status(400).json({
        message: "login failed",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "error logging in",
    });
  }
});

module.exports = usercontroller;
