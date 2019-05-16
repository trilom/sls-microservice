# Serverless Microservice Framework

## Diagram:
![api diagram](https://github.com/trilom/sls-microservice/blob/master/sls-microservice.jpg "API Diagram")

## How to use:
Like all infrastructure stacks, there is some soft of backend, and frontend.  In this case we have a front end implemented with API Gateway and a simple backend with 2 tables and a SQS queue to trigger a function.  
In order to use this stack you simply run the `make buildAll` and `make deployAll` command from within the `./backend` directory.  

## Why is it designed like this:
In order to gain fine control over each endpoint of your API this allows you to separate your project into distinct directories to lighten global dependencies.

### What does this build?
---
This will define an example Serverless infrastructure stack containing:
1. an API Gateway
The API has 6 endpoints.  One to create a user, one to get a user information, one to get a list of users, one to get a list of orders for a user, one to get order information for that user, and one to create an order.
2. two DynamoDB tables
One is the user table and one is the order table.
3. a SQS queue
An SQS queue that looks out for orders and moves them to fulfillment.
4. one backend lambda function, and three api lambda functions
The backend function will look for messages in the Order queue, then move them to fulfillment.
The API functions are split into 3 endpoints where you can implement different packages scope.

#### Endpoints
---
`/user` __GET__ - _List of users._  
`/user` __POST__ - _Create a user._  
`/user/{userid}` __GET__ - _User information._  
`/user/{userid}/orders` __GET__ - _Get order information for user._  
`/order` __POST__ - _Create an order._  
`/order/{orderid}` __GET__ - _Get order information._  

### Things to note
#### API Gateway RestApiId Exports and Usage
---
Take note in the `./backend/serverless.yml` we are exporting two variables from the stack.  This is for reuse in our child API endpoint stacks:
```yaml
#export from ./backend/serverless.yml
- Outputs:
    ApiGWRestApiId:
      Value:
        Ref: ApiGatewayRestApi
      Export:
        Name: ${self:custom.${self:provider.stage}.Stack}-restApiId-${self:provider.stage}
    ApiGWRootResourceId:
      Value:
        Fn::GetAtt:
          - ApiGatewayRestApi
          - RootResourceId
      Export:
        Name: ${self:custom.${self:provider.stage}.Stack}-rootResourceId-${self:provider.stage}
```
```yaml
#import from ./api/src/user/serverless.yml
provider:
  ...
  apiGateway:
    restApiId:
      'Fn::ImportValue': ${self:custom.${self:provider.stage}.Stack}-restApiId-${self:provider.stage}
    restApiRootResourceId:
      'Fn::ImportValue': ${self:custom.${self:provider.stage}.Stack}-rootResourceId-${self:provider.stage}
```

__Special Consideration:__ When nesting resources within other resources, for example we have the API endpoint of `/user/{userid}/orders`.  This endpoint is served separately from our `/user` endpoint, lets say you are using AWS Cognito for authentication, you can keep these dependencies separate from dependencies that access business function, like `/user/{userid}/orders` accesses the Orders table alone.  
__How is this accomplished?__  
1. We first export the shared resources from the parent resource `/user`.  

```yaml
#export from ./api/src/user/serverless.yml
resources:
  Outputs:
    ApiRootUser:
      Value:
        Ref: ApiGatewayResourceUser
      Export:
        Name: ${self:custom.${self:provider.stage}.Stack}-ApiRootUser-${self:provider.stage}
    ApiRootUserUseridVar:
      Value:
        Ref: ApiGatewayResourceUserUseridVar
      Export:
        Name: ${self:custom.${self:provider.stage}.Stack}-ApiRootUserUseridVar-${self:provider.stage}
```
2. We then import this shared resources as a `restApiResources` in the child resource `/user/{userid}/orders`  
```yaml
#import from ./api/src/user/order/serverless.yml
provider:
  ...
  apiGateway:
    restApiId:
      'Fn::ImportValue': ${self:custom.${self:provider.stage}.Stack}-restApiId-${self:provider.stage}
    restApiResources:
      /user/{userid}:
        'Fn::ImportValue': ${self:custom.${self:provider.stage}.Stack}-ApiRootUserUseridVar-${self:provider.stage}
```

### Commands
---
#### `make buildAll`
First it will run `yarn install` in the `./backend` directory, then it will look at each directory in the `./backend/src` directory and run `yarn install` for each, then it will run `make buildAll` from the `./api` directory.  This will look at each directory in the `./api/src` directory and run `yarn install` for each.
#### `make deployAll --STAGE='dev'`
First it will run `serverless deploy --stage dev` in the `./backend` directory and then it will run `make deployAll --STAGE='dev'` from the `./api` directory.  This will look at each directory in the `./api/src` directory and run `serverless deploy --stage dev` for each.

### Other commands:
---
#### `./api/make endpoint --SERVICE='billing'`
This will make a new endpoint in the `./api/src/billing` directory.  It will preload it with the serverless packages for the basic framework as well as set a baseline serverless.yml template.
#### `make removeAll --STAGE='dev'`
First it will run `serverless remove --stage dev` in the `./backend` directory and then it will run `make removeAll --STAGE='dev'` from the `./api` directory.  This will look at each directory in the `./api/src` directory and run `serverless remove --stage dev` for each.
#### `make cleanAll`
First it will remove `.serverless/` and `node_modules/**` in the `./backend` directory and then it will run `make removeAll --STAGE='dev'` from the `./api` directory.  This will look at each directory in the `./api/src` directory and remove `.serverless/` and `node_modules/**` for each.

#### `./backend/make deploy STAGE='dev'`
This will run `serverless deploy --stage dev` for the `./src/_root` endpoint.  
#### `./backend/make build SERVICE='orders'`
This will run `yarn install` for the backend code.  If you run this command without a `SERVICE` variable it will build the `serverless.yml` dependencies.
#### `./backend/make remove `
This will remove the serverless project, deleting the backend infrastructure.
#### `./backend/make clean SERVICE='orders'`
This will remove the `.serverless` and `node_modules/**` directory for the backend.  If you run this command without a `SERVICE` variable it will clean the `serverless.yml` dependencies.

#### `./api/make deploy SERVICE='user' STAGE='dev'`
This will run `serverless deploy --stage dev` for the `./src/user` endpoint.
#### `./api/make build SERVICE='user'`
This will run `yarn install` for the backend code.
#### `./api/make remove SERVICE='user'`
This will remove the serverless project, deleting the backend infrastructure.
#### `./api/make clean SERVICE='orders'`
This will remove the `.serverless` and `node_modules/**` directory for the backend.

## What do do from here:
* In more complicated examples you would be able to use AWS Cognito in the `/user` endpoint to set up authentication.  This endpoint would be scoped for user functions around Cognito and will likely have similar imports.  
* You could also import Stripe in a `/billing` endpoint to facilitate collection of payment information.  
* Within the `/orders` endpoint, you can set up your DynamoDB queries for managing your order collection.  
* You could set up CI/CD simply by adding a CodePipeline resource, and utilizing CodeBuild to pull down this repository, and run the make files.  
* Use the `serverless-domain-manager` plug-in to enable domain functionality.  Most of this structure is laid out, you just need to provide a valid `ApiHostedZone`, `ApiSite`, and `ApiCert`.  This can be created in the AWS Console for Route53 and ACM and provided here as variables.  
