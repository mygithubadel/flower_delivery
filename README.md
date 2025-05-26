# Flower Delivery API

this API was built using Node, Express, Typescript and MySQL. it supports:

 - user registration and authentication
 - order creation, update and retrieval ( protected endpoints )



## Running the project
**prerequisites**: docker and docker-compose

run
```bash
docker-compose up
```
in the root directory of the repository. it will run 2 containers, for Node and MySQL.
the server will be available at port 3000


## API Documentation

postman collection is available in the root folder of the repository, ready for import in postman
```bash
postman-collection.json
```

## Testing

a number of functional tests were added to the project, they use a second database for testing, the tables will be emptied after the test is completed.

there is a separate file for environment variables for the test environment, it is located in /backend/.env.test, tests are currently configured to be executed on the host machine.

**prerequisites**: **node** and **npm** installed on the host machine.

in the '**backend**' directory: 

install node modules:
```bash
npm i
```

run the tests:
```bash
npm test
```

```code
$ npm test

> backend@1.0.0 test
> jest

PASS test/user_order.test.ts
  User and Order API
    User authentication
      √ should return 401 Unauthorized when accessing orders without a token (36 ms)
      √ should register a new user (170 ms)
      √ should login user and get JWT token (80 ms)
      √ should return 409 conflict if username or email already exists (160 ms)
    Order create / update / fetch
      √ should create a new order and return the created order (18 ms)
      √ should fetch the order for the user (7 ms)
      √ should update all of the order fields and return the updated order (17 ms)
      √ should partially update the order and return the updated order (18 ms)
      √ should fetch orders filtered by status (11 ms)
      √ should create another order and fetch it along the previously created order (21 ms)
      √ should reject updating an order not owned by the user (176 ms)
    Order validation schema
      √ should return 400 when creating order with missing required fields (5 ms)
      √ should return 400 when creating order with invalid values (5 ms)
      √ should return 400 when updating order with no fields provided (4 ms)
      √ should return 400 when updating order with invalid field types (5 ms)
    User validation schema
      √ should return 400 when registering with missing fields (5 ms)
      √ should return 400 when registering with invalid email, password, phone, or username (4 ms)
      √ should return 400 when logging in with missing fields (4 ms)
      √ should return 400 when logging in with invalid username or password (4 ms)
    User invite
      √ should allow an authenticated user to invite a new user (81 ms)
      √ should allow the invited user to login (75 ms)
      √ should fail with 400 if invite payload is invalid (6 ms)
      √ should return 401 if invite is attempted without authentication (4 ms)
      √ should return 409 if invited username or email already exists (231 ms)

Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        4.323 s, estimated 15 s
Ran all test suites.

```
