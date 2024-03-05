const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      email,
      password: hashedPassword,
      tokens: [],
    });

    // Save user to database
    await user.save();

    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token

    if (user.tokens.length > 1) {
      return res.json({
        message: "User cannot login from more than 1 device",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    // Save token to user document
    user.tokens.push(token);
    await user.save();

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.accessProfile = async (req, res) => {
  try {
    res.json({ message: "Welcome to Homepage!!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.logOut = async (req, res) => {
  try {
    // Remove the token from the user's tokens array
    let userId = req.user.userId;
    const user = await User.findOne({ _id: userId });

    user.tokens = user.tokens.filter((token) => {
      return token !== req.headers.authorization.split(" ")[1];
    });

    await user.save();

    res.status(200).json({ message: "Logged out successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
