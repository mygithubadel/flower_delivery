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

there is a separate file for envionment variables for the test environment, its located in /backend/.env.test, tests are currently configured to be executed on the host machine.

in the backend directory: 

install node modules
```bash
npm i
```

run the tests
```bash
npm test
```

```code
PASS test/user_order.test.ts
  User and Order API
    User authentication
      √ should return 401 Unauthorized when accessing orders without a token (20 ms)
      √ should register a new user (143 ms)
      √ should login user and get JWT token (75 ms)
      √ should return 409 conflict if username or email already exists (159 ms)
    Order create / update / fetch
      √ should create a new order and return the created order (14 ms)
      √ should fetch the order for the user (6 ms)
      √ should update all of the order fields and return the updated order (14 ms)
      √ should partially update the order and return the updated order (12 ms)
      √ should fetch orders filtered by status (7 ms)
      √ should create another order and show it in the GET api (11 ms)
      √ should fetch all previously added orders when no filter is assigned (5 ms)
      √ should reject updating an order not owned by the user (173 ms)
    Order validation schema
      √ should return 400 when creating order with missing required fields (5 ms)
      √ should return 400 when creating order with invalid values (4 ms)
      √ should return 400 when updating order with no fields provided (4 ms)
      √ should return 400 when updating order with invalid field types (3 ms)
    User validation schema
      √ should return 400 when registering with missing fields (4 ms)
      √ should return 400 when registering with invalid email, password, phone, or username (3 ms)
      √ should return 400 when logging in with missing fields (3 ms)
      √ should return 400 when logging in with invalid username or password (3 ms)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        2.509 s, estimated 3 s
Ran all test suites.
