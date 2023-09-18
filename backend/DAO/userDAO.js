require("dotenv").config();
const {
  DynamoDBClient,
  ScanCommand,
  PutItemCommand,
  GetItemCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { unmarshall, marshall } = require("@aws-sdk/util-dynamodb");

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });
const TABLE_NAME = process.env.TABLE_NAME;

const getUsers = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
  });

  const response = await ddb.send(command);
  let unmarshalledItems = response.Items.map((item) => {
    return unmarshall(item);
  });

  response.Items = unmarshalledItems;

  return response;
};

const getUserById = async (id) => {
  const command = new GetItemCommand({
    TableName: TABLE_NAME,
    Key: {
      user_id: marshall(id),
    },
  });

  const response = await ddb.send(command);
  response.Item = unmarshall(response.Item);

  return response;
};

const createUser = async (user) => {
  const command = new PutItemCommand({
    TableName: TABLE_NAME,
    Item: marshall(user),
  });

  const response = await ddb.send(command);

  return response;
};

const deleteUser = async (id) => {
  const command = new DeleteItemCommand({
    TableName: TABLE_NAME,
    Key: {
      user_id: marshall(id),
    },
  });

  const response = await ddb.send(command);
  console.log(response);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
};
