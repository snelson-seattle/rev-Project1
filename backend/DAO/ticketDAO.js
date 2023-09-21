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

const getPendingTickets = async () => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "#s = :status",
    ExpressionAttributeNames: {
      "#s": "status",
    },
    ExpressionAttributeValues: {
      ":status": "Pending",
    },
    ConsistentRead: true,
  });

  const response = await client.send(command);

  if (response["$metadata"].httpStatusCode === 200) {
    return response.Items;
  } else {
    return [];
  }
};

const getUserTickets = async (username) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "username = :username",
    ExpressionAttributeValues: {
      ":username": username
    },
  });

  const response = await client.send(command);
  
  if(response["$metadata"].httpStatusCode === 200){
    return response.Items;
  }else{
    return []
  }
}

const getFilteredUserTickets = async (username, ticketType) => {
  const command = new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "#username = :username AND #type = :type",
    ExpressionAttributeNames: {
      "#username": "username",
      "#type": "type"
    },
    ExpressionAttributeValues: {
      ":username": username,
      ":type": ticketType
    },
  });

  const response = await client.send(command);
  
  if(response["$metadata"].httpStatusCode === 200){
    return response.Items;
  }else{
    return []
  }
}

const getTicketById = async (id) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      ticket_id: id,
    },
  });

  const response = await client.send(command);
  if (response["$metadata"].httpStatusCode === 200) {
    return response.Item;
  } else {
    return {};
  }
};

const approveTicket = async (id) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      ticket_id: id,
    },
    ConditionExpression: "#s = :p",
    UpdateExpression: "SET #s = :a",
    ExpressionAttributeNames: {
      "#s": "status"
    },
    ExpressionAttributeValues: {
      ":a": "Approved",
      ":p": "Pending"
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await client.send(command);
  if(response["$metadata"].httpStatusCode === 200) {
    return response.Attributes
  }else{
    return {}
  }
};

const denyTicket = async (id) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      ticket_id: id,
    },
    ConditionExpression: "#s = :p",
    UpdateExpression: "SET #s = :d",
    ExpressionAttributeNames: {
      "#s": "status"
    },
    ExpressionAttributeValues: {
      ":d": "Denied",
      ":p": "Pending"
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await client.send(command);
  if(response["$metadata"].httpStatusCode === 200) {
    return response.Attributes
  }else{
    return {}
  }
}

const createTicket = async (ticket) => {
  const id = crypto.randomUUID();
  const newTicket = { ...ticket, ticket_id: id, status: "Pending" };
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: newTicket,
  });

  const response = await client.send(command);
  if (response["$metadata"].httpStatusCode === 200) {
    return newTicket;
  } else {
    return {};
  }
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
  getPendingTickets,
  getUserTickets,
  getFilteredUserTickets,
  getTicketById,
  createTicket,
  deleteTicket,
  approveTicket,
  denyTicket
};
