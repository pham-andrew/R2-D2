# R2D2 - Rapid Routing & Decision-making Dashboard

<img src="./ui/public/favicon.png" alt="R2D2" width="40%"/>

## Table of Contents

1.  [Overview](#Overview)
2.  [Description](#Description)
3.  [Usage](#Usage)
4.  [Installation](#Installation)
5.  [Libraries](#Libraries)
6.  [License](#License)

## Overview

The Rapid Routing and Decision-making Dashboard (R2D2) is a unit-centric task-flow management system that enables accountable and informed decision-making at all levels in the CoC. Most of today's task-flows involve one of the following:

1.  Disaggregated, unintuitive, and/or expensive enterprise work flows (e.g. Sharepoint, TMT, TopVue, LeaveWeb),
2.  Hundreds of thousands of long email chains of questionable standardization and accountability, or even worse,
3.  Pen and paper processes

All of these methods significantly reduce both the velocity and efficacy of the decision-making loopm and provide little to no interconnectivity or modularity for a digitally-oriented force.

R2D2 is built by those of us who experienced the pain of using all of those systems. Out team's instantiation of a task-flow management system fills in the gaps of those other systems and provides the foundation for improvements such as: intra-unit customizability, inter-unit task-flow hooks, Active Directory or LDAP-based data injection, and operational metrics generation.

## Description

From the database schema to the user interface (UI) and experience (UX), this full-stack PostgreSQL, ExpressJS, ReactJS, and NodeJS (PERN) application was designed with scalability and accessibility in mind. The UI contains conditional rendering, modular dialog components, and intuitive clickstreams for user input and notification. The API handles requests sent to it by the UI and forwards them to the PostgreSQL database. SQL is used in these queries to find, join, and manipulate data so that the API can send the right data back to the UI for display. User passwords are protected with encryption, and authorization is required to access protected routes. Cookies containing an encrytped secret token are used to persist login and re-acquire state for a logged-in user. The PostgreSQL database is set-up with data validation and cascading. Foreign and primary key relationships dynamically alter table data based on user changes and inputs.

Below is a breakdown of the stack:

- Runtime environment: NodeJS
- SQL database: PostgreSQL
- UI: ReactJS
- API server: ExpressJS

Below is a list of applicable links:

- Project Board: [Miro](https://miro.com/app/board/o9J_l5ZAx5k=/)
- Repository: [GitHub](https://github.com/pham-andrew/SDI-Capstone-Group-5)
- Deployment: [PlatformONE](https://sdi05-05.staging.dso.mil/)
- Planning and Execution: [Miro](https://miro.com/app/board/o9J_l5ZAx5k=/)
  1.  Problem Statement
  2.  Definitions
  3.  Use Cases
  4.  User Stories
  5.  Wireframes
  6.  Entity Relationship Diagrams
  7.  Kanban Board
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

2. Start your Docker app and run the following command to spin-up PostgreSQL and the required database: `docker run --rm --name r2d2 --env-file ./.env -p 5432:5432 postgres:latest`

3. Go to the UI folder and execute `npm install`

4. Go to the api folder and execute `npm install`

5. (OPTIONAL) If you change the seeds or migrations, or the database becomes corrupted, you can run `npm run reset` in the API folder to run the migrations and seeds again.

6. Go to the UI and execute `npm run dev` to start the ReactJS app.

7. Go to the API and execute `npm run dev` to start the ExpressJS API.

8. Proceed to the address and port for the UI as specified in your .env file (e.g. http://localhost:3000)

9. Proceed to the address and port for the API API as specified in your .env file (e.g. http://localhost:3001/api)

### Environment Variables

Environment variables that control the operation of the app are defined in the
`.env` file in the application root. These variables and their usage are shown
in the following table.

Environment variables maintained in the `.env` file are made available to the
application code via `process.env.<variable-name>`. For example, the
port for the UI is accessed in the code by referencing
`process.env.PORT`.

| Environment Variable | Description         | Example Setting | Applicability |
| :------------------- | :------------------ | :-------------- | :------------ |
| POSTGRES_DB          | Database name       | r2d2            | API, database |
| POSTGRES_USER        | PostgreSQL username | postgres        | API, database |
| POSTGRES_PASSWORD    | PostgreSQL password | docker          | API, database |

## Libraries

### UI

| Module/Library | Environment | Description                                        |
| :------------- | :---------- | :------------------------------------------------- |
| material-ui    | Development | Component library                                  |
| react          | Runtime     | Framework, JS library                              |
| react-dom      | Runtime     | DOM renderer for React                             |
| react-scripts  | Runtime     | Scripts and configuration used by Create React App |
| js-cookie      | Runtime     | Cookie library                                     |

### API

| Module/Library | Environment | Description        |
| :------------- | :---------- | :----------------- |
| nodemon        | Development | Live API updates   |
| express        | Runtime     | Web framework      |
| cookie-parser  | Runtime     | Cookie middleware  |
| cors           | Runtime     | CORS middleware    |
| pg             | Runtime     | Postgres client    |
| bcrypt         | Runtime     | Encryption library |

## License

This software is licensed under the [MIT](./LICENSE) license.
