const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });
const client = DynamoDBDocumentClient.from(ddb);
const TABLE_NAME = process.env.USER_TABLE;

const getUsers = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });

  const response = await client.send(command);

  if (response["$metadata"].httpStatusCode === 200) {
    return response.Items;
  } else {
    return [];
  }
};

const getUser = async (username) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      username,
    }
  });

  const response = await client.send(command);
  if (response["$metadata"].httpStatusCode === 200) {
    return response.Item;
  } else {
    return {};
  }
};

const createUser = async (user) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: user,
    ConditionExpression: "attribute_not_exists(username)",
  });

  const response = await client.send(command);
  if (response["$metadata"].httpStatusCode === 200) {
    return user;
  } else {
    return {};
  }
};

const deleteUser = async (id) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      user_id: id,
    },
  });

  const response = await client.send(command);

  if (response["$metadata"].httpStatusCode === 200) {
    return { message: `user with email address ${email} was deleted` };
  } else {
    return { message: "failed to delete user" };
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
};
