This project was created from the create-react-app project which is a ready-made React application starter.

## Get Started
Install your node modules

`npm i`

Run the app

`npm start`

## run cypress tests locally in container

`docker run -it -v $PWD:/e2e -w /e2e cypress/included:3.4.0 --env configFile=pipeline`
