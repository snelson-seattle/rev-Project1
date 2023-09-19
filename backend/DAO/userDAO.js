require("dotenv").config();
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
const TABLE_NAME = process.env.TABLE_NAME;

const getUsers = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });

  const response = await client.send(command);

  if (response.Items !== undefined) {
    return response.Items;
  } else {
    return [];
  }
};

const getUser = async (email) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      email,
    },
  });

  const response = await client.send(command);

  if (response.Item !== undefined) {
    return response.Item;
  } else {
    return {};
  }
};

const createUser = async (user) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: user,
  });

  const response = await client.send(command);
  if (response['$metadata'].httpStatusCode === 200) {
    return user;
  } else {
    return {};
  }
};

const deleteUser = async (email) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      email
    }
  });

  const response = await client.send(command);
  console.log(response);
  
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
};
