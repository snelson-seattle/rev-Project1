const bcrypt = require("bcrypt");
const DAO = require("../DAO");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {};

const logout = async (req, res) => {};

const register = async (req, res) => {
  const { email, password } = req.body;

  // Make sure request included an email and password
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    // Check if user already exists with given email
    const existingUser = await DAO.users.getUser(email);
    if (existingUser?.email) {
      return res.status(409).json({ message: "email address is in use" });
    }

    // CREATE NEW USER
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await DAO.users.createUser({
      email,
      password: hashedPassword,
      manager: false,
    });

    if (newUser) {
      return res.status(201).json({ message: "New user created successfully" });
    }

    return res.status(500).json({ message: "Something went wrong" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  register,
  login,
  logout
};
