# Serverless Microservice Framework

## How to use:
⋅⋅⋅Like all infrastructure stacks, there is some soft of backend, and frontend.  In this case, our frontend is an API and out backend is just a cron job.
⋅⋅⋅In order to use this stack you simply run the `make buildAll` and `make deployAll` command from within the `./backend` directory.

### What does this build?
This will define an example Serverless infrastructure stack containing:
1. an API Gateway
The API has 6 endpoints.  One to create a user, one to get a user information, one to get a list of users, and one to get order information for that user.
2. two DynamoDB tables
One is the user table and one is the order table.
3. a SQS queue
An SQS queue that looks out for orders and moves them to fulfillment.
4. one backend lambda function, and three api lambda functions
The backend function will look for messages in the Order queue, then move them to fulfillment.
The API functions are split into 3 endpoints where you can implement different packages scope.

#### Endpoints
⋅⋅⋅`/user` __GET__ - _List of users._
⋅⋅⋅`/user` __POST__ - _Create a user._
⋅⋅⋅`/user/{userid}` __GET__ - _User information._
⋅⋅⋅`/user/{userid}/orders` __GET__ - _Get order information for user._

⋅⋅⋅`/order` __POST__ - _Create an order._
⋅⋅⋅`/order/{orderid}` __GET__ - _Get order information._

### What does this do?
#### `make buildAll`
First it will run `yarn install` in the `./backend` directory and then it will run `make buildAll` from the `./api` directory.  This will look at each directory in the `./api/src` directory and run `yarn install` for each.
#### `make deployAll --STAGE='dev'`
First it will run `serverless deploy --stage dev` in the `./backend` directory and then it will run `make deployAll --STAGE='dev'` from the `./api` directory.  This will look at each directory in the `./api/src` directory and run `serverless deploy --stage dev` for each.

### Other commands:
#### `./api/make endpoint --SERVICE='billing'`
This will make a new endpoint in the `./api/src/billing` directory.  It will preload it with the serverless packages for the basic framework as well as set a baseline serverless.yml template.
#### `make removeAll --STAGE='dev'`
First it will run `serverless remove --stage dev` in the `./backend` directory and then it will run `make removeAll --STAGE='dev'` from the `./api` directory.  This will look at each directory in the `./api/src` directory and run `serverless remove --stage dev` for each.
#### `make cleanAll`
First it will remove `.serverless/` and `node_modules/**` in the `./backend` directory and then it will run `make removeAll --STAGE='dev'` from the `./api` directory.  This will look at each directory in the `./api/src` directory and remove `.serverless/` and `node_modules/**` for each.
#### `./backend/make deploy STAGE='dev'`
This will run `serverless deploy --stage dev`
#### `./backend/make build`
This will run `yarn install` for the backend code.
#### `./backend/make remove STAGE='dev'`
This will remove the serverless project, deleting the backend infrastructure.
#### `./backend/make clean`
This will remove the `.serverless` and `node_modules/**` directory for the backend.
#### `./api/make deploy SERVICE='user' STAGE='dev'`
This will run `serverless deploy --stage dev` for the `./src/user` endpoint.
#### `./api/make build SERVICE='user'`
This will run `yarn install` for the backend code.
#### `./api/make remove SERVICE='user'`
This will remove the serverless project, deleting the backend infrastructure.
#### `./api/make clean`
This will remove the `.serverless` and `node_modules/**` directory for the backend.

## What do do from here:
⋅⋅⋅In more complicated examples you would be able to use AWS Cognito in the `/user` endpoint to set up authentication.  This endpoint would be scoped for user functions around Cognito and will likely have similar imports.
⋅⋅⋅You could also import Stripe in a `/billing` endpoint to facilitate collection of payment information.
⋅⋅⋅Within the `/orders` endpoint, you can set up your DynamoDB queries for managing your order collection.
