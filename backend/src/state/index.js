/*jshint esversion: 8 */
const log4js = require('log4js');
var logLevel = process.env.logLevel;
var env = process.env.env;

const logger = log4js.getLogger('logger');

log4js.configure({
  appenders: {
    logger: { type: 'console' }
  },
  categories: { default: { appenders: ['logger'], level: logLevel}}
});

function returnJson(statusCode, body) {
  logger.debug('In ReturnJson: ');
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE',
    'Access-Control-Allow-Origin': '*'};
  return {
    'statusCode': statusCode,
    'body': JSON.parse(JSON.stringify(body)),
    'headers': headers};
}

exports.handler = async (event, context) => {
  return returnJson(200, {body: 'Test', event: event});
};
