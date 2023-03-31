# Northcoders House of Games API

HOSTED VERSION:
https://nc-be-games.onrender.com

PROJECT DESCRIPTION:
A backend API for a database of board games.

INSTRUCTIONS:
To create a local copy of this repo you will need to fork the repo on GitHub, copy the https url and using the command line enter: git clone <https url>. Once in the repo, you will need to run npm install to install all the necessary dependencies. The project was created using node v18.14.0 & psql version 15.2.

To seed the database use the following commands in order: 'npm run setup-dbs' & 'npm run seed'. To seed the production database, 'npm run seed-prod' will need to be used. To test the files you will need to use 'npm test'.

To connect to the two databases locally you will need to create two .env files: .env.test and .env.development. Add PGDATABASE=nc_games_test into the test file and PGDATABASE=nc_games into the development file.
