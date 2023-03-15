## TODO App with Nest.js

This is a simple TODO application built with Nest.js.

## Getting Started

To run this application, make sure you have Docker installed on your system. Then run the following command:

```sh
docker-compose up -d --build
```

This will build the application, connect to the database, and start the Nest.js server.

## API

The following APIs are available for the TODO app:

### Register User

```sh
POST /auth/register
```

Register a new user with the following request body:

```sh
{
  "login": "john@gmail.com",
  "password": "password"
}
```

### Login User

```sh
POST /auth/login
```

Login with the following request body:

```sh
{
  "login": "john@gmail.com",
  "password": "password"
}
```

This will return a JWT token that you can use for authenticated requests.

### Create TODO

```sh
POST /todo/create
```

Create a new TODO with the following request body:

```sh
{
  "title": "Buy groceries",
  "description": "Buy milk, eggs, and bread"
}
```

You must provide a valid JWT token in the Authorization header.

### Get TODO by ID

```sh
GET /todo/:id
```

Get a TODO by ID.

You must provide a valid JWT token in the Authorization header.

### Delete TODO by ID

```sh
DELETE /todo/:id
```

Delete a TODO by ID.

You must provide a valid JWT token in the Authorization header.

### Update TODO by ID

```sh
PATCH /todo/:id
```

Update a TODO by ID with the following request body:

```sh
{
  "title": "Buy groceries",
  "description": "Buy milk, eggs, and cheese"
}
```

You must provide a valid JWT token in the Authorization header.

### Get All TODOs

```sh
GET /todo
```

Get all TODOs.

You must provide a valid JWT token in the Authorization header.

## Configuration

In order to run the application, you will need to create a `.env` file with the following configuration:

```sh
MONGO_LOGIN=your_login
MONGO_PASSWORD=your_password
MONGO_HOST=your_host
MONGO_AUTHDATABASE=your_auth_database
JWT_SECRET=your_secret
APP_PORT=8080
```

Make sure to update the values with your own credentials.


