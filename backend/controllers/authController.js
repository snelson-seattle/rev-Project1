const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DAO = require("../DAO");

const login = async (req, res) => {
  const { username, password } = req.body;

  // Make sure request included an email and password
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  try {
    // Check if user already exists with given email
    const existingUser = await DAO.users.getUser(username);
    if (!existingUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check for password match
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Create Access and Refresh Tokens
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: existingUser.username,
          manager: existingUser.manager,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "600s" } // This should be set much higher when moving to production
    );

    const refreshToken = jwt.sign(
      { username: existingUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Create a secure cookie with the refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false, // https
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // No Content
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  res.status(200).json({ message: "Logout successful" });
};

const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        console.error(err);
        return res.status(403).json({ message: "Forbidden" });
      }

      const existingUser = await DAO.users.getUser(decoded.email);
      console.log(existingUser);
      if (!existingUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Create a new access token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: existingUser.email,
            manager: existingUser.manager,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10s" } // This should be set much higher when moving to production
      );

      res.status(200).json({ accessToken });
    }
  );
};

const register = async (req, res) => {
  const { username, password } = req.body;

  // Make sure request included a username and password
  if (!username || !password) {
    return res.status(400).json({ message: "username and password are required" });
  }

  try {
    // CREATE NEW USER
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await DAO.users.createUser({
      username,
      password: hashedPassword,
      manager: false,
    });

    if(!newUser){
      return res.status(409).json({message: "username is already in use"});
    }

    // Create Access and Refresh Tokens
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: newUser.username,
          manager: newUser.manager,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "600s" } // This should be set much higher when moving to production
    );

    const refreshToken = jwt.sign(
      { username: newUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Create a secure cookie with the refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: false, // https
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(201)
      .json({ message: "New user created successfully", accessToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  refresh,
  register,
  login,
  logout,
};
