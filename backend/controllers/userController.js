const DAO = require("../DAO");
const bcrypt = require("bcrypt");

const updateUser = async (req, res) => {
  const { username, manager } = req;

  try {
    // Check to see if the access token provided came from a manager
    if (manager) {
      // Get the username to be updated, and the new manager status for that user
      const { username: employeeName, manager: managerStatus } = req.body;
      // Update user to a manager, or update the user from manager to normal user
      // based on the manager status
      let updatedUser = {};
      if (managerStatus) {
        updatedUser = await DAO.users.updateUserToManager(employeeName);
      } else {
        updatedUser = await DAO.users.updateManagerToUser(employeeName);
      }

      return res
        .status(201)
        .json({ message: "User updated successfully", user: updatedUser });
    }

    // If the access token provided came from a normal user
    const updatedUserInfo = req.body;
    const existingUser = await DAO.users.getUser(username);
    if(updatedUserInfo.password){
      updatedUserInfo.password = bcrypt.hashSync(updatedUserInfo.password, 10);
    }
    const userObj = { ...existingUser, ...updatedUserInfo, manager: existingUser.manager };
    const updatedUser = await DAO.users.updateUserInfo(userObj);

    if (updatedUser) {
      return res
        .status(201)
        .json({ message: "Successfully updated user info", user: updatedUser });
    }

    return res.status(500).json({message: "Something went wrong"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUsers = async (req, res) => {
    try {
        const users = await DAO.users.getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Something went wrong"});
    }
}

module.exports = {
  updateUser,
  getUsers
};
