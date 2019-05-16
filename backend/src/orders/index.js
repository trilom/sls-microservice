/*jshint esversion: 9 */
const log4js = require('log4js');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const ordersQueue = process.env.ordersQueue;
const ordersTable = process.env.ordersTable;
const logLevel = process.env.logLevel;

const logger = log4js.getLogger('logger');
log4js.configure({
  appenders: { logger: { type: 'console' }},
  categories: { default: { appenders: ['logger'], level: logLevel }}
});

// table - Table name
// key - key of item
// ue - updateExpression
// eav - ExpressionAttributeValues
async function updateTable({ table, key, ue, eav}) {
  try {
    return await docClient.update({ TableName: table, Key: key, UpdateExpression: ue, ExpressionAttributeValues: eav}).promise();
  }
  catch (err) {
    logger.error('Update Table Error: ', err);
    throw err;
  }
}

async function deleteMessage(queue, receiptHandle) {
  var deleteParams = {
    QueueUrl: queue,
    ReceiptHandle: receiptHandle};
  try {
    const data = await sqs.deleteMessage(deleteParams).promise();
    logger.debug('Message Deleted: ', data);
  }
  catch(err) {
    logger.error("Message Delete Error: ", err);
    throw err;
  }
}

exports.handler = async (event, context) => {
  if (event.Records) {
    return Promise.all(event.Records.map(async (message) => {
      let body = JSON.parse(message.body);
      // update table
      // delete message
    }));
  }
};
