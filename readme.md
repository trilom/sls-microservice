# Serverless Microservice Framework

This is using the Serverless framework to build a microservice with AWS.

In this example, we have two 'backend' functions simulating a backend function.
In this case, function 'User' will write a record to the 'User' DynamoDB table every 1 minute,
after this it will send a message to the 'State' SQS Queue which triggers the 'State' function.
The 'State' backend function will write a record to the state table.

To serve the backend, there is an API served from the 'api' directory.  The api
is a set of individually packaged endpoints served with API Gateway.
