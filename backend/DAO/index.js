const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME= "users";

const getUsers = async () => {
  // Configure parameters for the scan
  const params = {
    TableName: TABLE_NAME,
  };

  let results = await dynamoClient.scan(params).promise();
  return results; 
}

const getUserById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            user_id: id,
        }
    }

    return await dynamoClient.get(params).promise();
}

const createUser = async (user) => {  
    const params = {
        TableName: TABLE_NAME,
        Item: user,
    }

    return await dynamoClient.put(params).promise();
}

const deleteUser = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            user_id: id
        }
    }

    return await dynamoClient.delete(params).promise();
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
};
