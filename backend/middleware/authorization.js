const jwt = require("jsonwebtoken");

const managerAccess = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Make sure the request is coming from a manager user
    if (!decoded.UserInfo.manager) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.username = decoded.UserInfo.email;
    req.manager = decoded.UserInfo.manager;
    next();
  });
};

const userAccess = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Make sure the request is coming from an user
    if (decoded.UserInfo.manager) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.username = decoded.UserInfo.username;
    req.manager = decoded.UserInfo.manager;
    next();
  });
};

const authenticatedUserAccess = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.username = decoded.UserInfo.username;
    req.manager = decoded.UserInfo.manager;
    next();
  });
}

module.exports = {
  authenticatedUserAccess,
  managerAccess,
  userAccess,
};
