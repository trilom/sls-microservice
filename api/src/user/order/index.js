/*jshint esversion: 9 */
const log4js = require('log4js');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const moment = require('moment');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const ordersTable = process.env.ordersTable;
const logLevel = process.env.logLevel;

const app = express();

const logger = log4js.getLogger('logger');
log4js.configure({
  appenders: { logger: { type: 'console' }},
  categories: { default: { appenders: ['logger'], level: logLevel }}
});

app.use(cors({
  allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'X-Amz-Date,', 'X-Amz-Security-Token', 'X-Api-Key'],
  maxAge: 600
}));
app.use(bodyParser.json({ strict: false }));

// table - Table name
// kce - Key Condition Expression
// eav - ExpressionAttributeValues
// ean - ExpressionAttributeNames
// pe - Projection Expression
async function queryTable({ table, kce, fe, eav, ean, pe, sif, limit, esk = true}) {
  let response = {};
  let data = [];
  let ExclusiveStartKey;
  try {
    logger.debug(`table:${table} pe:${pe} kce:${kce} fe:${fe} eav:${JSON.stringify(eav)} ean:${JSON.stringify(ean)} sif:${sif} esk:${esk}` );
    do {
      response = await docClient.query({
        TableName: table,
        ProjectionExpression: pe,
        KeyConditionExpression: kce,
        FilterExpression: fe,
        ExpressionAttributeValues: eav,
        ExpressionAttributeNames: ean,
        ScanIndexForward: sif,
        Limit: limit,
        ExclusiveStartKey
      }).promise();
      data = data.concat(response.Items);
      ExclusiveStartKey = (esk) ? response.LastEvaluatedKey : undefined;
    } while (ExclusiveStartKey);
    return data;
  }
  catch (err) {
    logger.error('Query Table Error: ', err);
    throw err;
  }
}

// ROUTES
app.get('/user/:userid/orders', async (req, res) => {
  try {
    // query to orders for user
    res.status(200).json({body: `User was successfully created`});
  }
  catch (err) {
    res.status(504).json({body: 'Get orders error.'});
  }
});

const handler = serverless(app);
exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
