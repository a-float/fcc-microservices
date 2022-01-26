# fcc-microservices
All in one solution to the projects for FreeCodeCamps APi and Microservies certification

### I used   
express with middleware packages such as morgan for logging, pug for rendering and mongoDB as a database

### How it works
The entry point is the server.js file.
Solutions to each of the projects can be found in the projects folder. All the routes and logic defined within this folder are initialized in the server.js file.

### How to run
```
npm install
npx nodemon ./server.js
```
### Required .env variables
PORT - port to server the app
DB_URI - database uri used in project no 4
