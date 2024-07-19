const User = require("../schema/userSchema");
const createError = require("../utils/appError");
const brcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//REGISTER USER
exports.signUp = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new createError("User already exists", 400));
    }
    const hashedPassword = await brcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // assign JWT
    const token = jwt.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "5hr",
    });

    res.status(201).json({
      status: "success",
      message: "user registered successfully",
      token: token,
      user: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return next(new createError("User not found", 404));
    }

    const isPassword = await brcrypt.compare(password, user.password);
    if (!isPassword) {
      return next(new createError("Incorrect email or password", 401)); // Use 401 for unauthorized access
    }
    const token = jwt.sign({ _id: user._id }, "secretkey123", {
      expiresIn: "5hr",
    });

    res.status(200).json({
      status: "success",
      token,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email, // Corrected typo here
      },
    });
  } catch (error) {
    next(error);
  }
};
