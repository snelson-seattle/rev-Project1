require("dotenv").config();
const crypto = require("crypto");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const ddb = new DynamoDBClient({ region: process.env.AWS_REGION });
const client = DynamoDBDocumentClient.from(ddb);
const TABLE_NAME = process.env.TICKET_TABLE;

const getTickets = async () => {
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

const getTicketById = async (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      ticket_id: id,
    },
  });

  const response = await client.send(command);
  console.log(response);
};

const approveTicket = async (id) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      ticket_id: id,
    },
    UpdateExpression: "SET status = :status",
    ExpressionAttributeValues: {
      ":status": "Approved",
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await client.send(command);
  console.log(response);
};

const createTicket = async (ticket) => {
  const id = crypto.randomUUID();
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: { ...ticket, ticket_id: id, status: "Pending" },
  });

  const response = await client.send(command);
  console.log(response);
};

const deleteTicket = async (id) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      ticket_id: id,
    },
  });

  const response = await client.send(command);
  console.log(response);
};


module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  deleteTicket,
};
