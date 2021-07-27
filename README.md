# R2D2 - Rapid Routing & Decision Dashboard

<img src="./ui-master/public/favicon.png" alt="R2D2" width="40%"/>

## Table of Contents

1.  [Overview](#Overview)
2.  [Description](#Description)
3.  [Usage](#Usage)
4.  [Installation](#Installation)
5.  [Libraries](#Libraries)
6.  [License](#License)

## Overview

R2D2 was made for the USSF SDI Cohort #2 capstone project for group #05. This

- Database: built in PostgreSQL
- Client: built in ReactJS
- Server: built using Express
- Repository: [GitHub](https://github.com/pham-andrew/SDI-Capstone-Group-5)
- Deployment: [PlatformONE](https://sdi05-05.staging.dso.mil/)
- Project Board: [Miro](https://miro.com/app/board/o9J_l5ZAx5k=/)

## Description

This full-stack PERN application features a ReactJS client-facing interface, an ExpressJS server with Knex and Pooling calls to the database, and a PostgreSQL database.

The client contains conditional rendering, protected routes, and modular dialog components for user input and notification.

The server handles requests sent to it by the client and forwards them to the database. SQL is used to send queries to the database and manipulate data from the resulting queries so that the server can send the right data to the client-side display. User passwords are protected with secure hashing and salting functionality. Cookies with a randomized token are used to persist login for approximately 1-day.

The PostgreSQL database is set-up with data validation and cascading. Foreign and primary key relationships dynamically alter table data based on user changes and inputs.

[Here is a link to the Miro board](https://miro.com/app/board/o9J_l5ZAx5k=/) which contains the following:

1. Problem Statement
2. Definitions
3. Use Cases
4. Wireframes
5. Entity Relationship Diagrams
6. Kanban Board
   - To Do
   - In Progress
   - Done
   - Wishlist

## Installation

The installation options below are ordered from least configurable to most configurable.

### PlatformONE

1. To use the application hosted on Heroku, please click or paste the following URL in your browser: https://sdi05-05.staging.dso.mil/.

### Source Code

_NOTE 1_: The following instructions must be read and followed in-order!

_NOTE 2_: The set-up of this repository and instructions were made to be as developer-agnostic as possible. Custom configuration for ports and names can be done in the .env.example file as noted later in this installation section.

1. Modify the .env.example file using the format commented within the .env.example file. Delete the .example portion of the extension from the .env file before running the application. Run setup.sh after you are done making modifications.

2. Start your Docker app and run the following command to spin-up PostgreSQL and the required database: `docker run --rm --name shop-till-you-drop -v $PWD/db:/docker-entrypoint-initdb.d/ --env-file ./config/.env -p $(awk -F "=" '/PG_PORT/{print $NF}' ./config/.env):5432 postgres:latest`

3. Go to the client folder and execute `npm install`

4. Go to the server folder and execute `npm install`

5. (OPTIONAL) If you change the seeds or migrations, or the database becomes corrupted, you can run `npm run db:reset` in the server folder to run the migrations and seeds again.

6. Go to the client and execute `npm run dev` to start the React app.

7. Go to the server and execute `npm run dev` to start the Express server.

8. Proceed to the address and port for the client as specified in your .env file (e.g. http://localhost:3000)

9. Proceed to the address and port for the API server as specified in your .env file (e.g. http://localhost:3001/api)

### Environment Variables

Environment variables that control the operation of the app are defined in the
`.env` file in the application root. These variables and their usage are shown
in the following table.

Environment variables maintained in the `.env` file are made available to the
application code via `process.env.<variable-name>`. For example, the
port for the client is accessed in the code by referencing
`process.env.PORT`.

| Environment Variable | Description                              | Example Setting                  | Applicability    |
| :------------------- | :--------------------------------------- | :------------------------------- | :--------------- |
| PORT                 | Local and/or container port for client   | 3000                             | server, client   |
| HOST_DEV             | Local and/or container host for server   | localhost                        | server, client   |
| HOST_LIVE            | Deployed host for server                 | shop-till-you-drop.herokuapp.com | server, client   |
| HOST_DB              | Docker host for database                 | postgres                         | server           |
| PROTO_DEV            | Local and/or container protocol          | http                             | server. client   |
| PROTO_LIVE           | Deployed protocol                        | https                            | server, client   |
| API_PORT             | Local and/or container port API server   | 3001                             | server, client   |
| POSTGRES_DB          | Database name                            | shop-till-you-drop               | server, database |
| POSTGRES_USER        | PostgreSQL username                      | postgres                         | server, database |
| POSTGRES_PASSWORD    | PostgreSQL password                      | docker                           | server, database |
| PG_PORT              | Local and/or container port for database | 5432                             | server, database |

## Libraries

### Client

| Module/Library    | Environment | Description                                        |
| :---------------- | :---------- | :------------------------------------------------- |
| @material-ui/core | Development | Material Design React components                   |
| pg                | Runtime     | PostgreSQL client                                  |
| react-markdown    | Runtime     | Markdown to HTML parser                            |
| remark-gfm        | Runtime     | GitHub markdown extension                          |
| react             | Runtime     | UI Library                                         |
| react-dom         | Runtime     | DOM renderer for React                             |
| react-scripts     | Runtime     | Scripts and configuration used by Create React App |
| dotenv            | Runtime     | .env file reader                                   |
| js-cookie         | Runtime     | Cookies                                            |

### Server

| Module/Library | Environment | Description         |
| :------------- | :---------- | :------------------ |
| debug          | Development | Debug utility       |
| nodemon        | Development | Live server updates |
| express        | Runtime     | Web framework       |
| http-errors    | Runtime     | Http error creation |
| morgan         | Runtime     | Logger              |
| jade           | Runtime     | Template engine     |
| cookie-parser  | Runtime     | Cookie middleware   |
| cors           | Runtime     | CORS middleware     |
| dotenv         | Runtime     | .env file reader    |
| pg             | Runtime     | Postgres client     |
| bcrypt         | Runtime     | Hash and Salt       |

## License

This software is licensed under the [MIT](./LICENSE) license.
