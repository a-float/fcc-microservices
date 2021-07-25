# fcc-microservices
All in one solution to the projects for FreeCodeCamps APi and Microservies certification

### I used   
express with some middleware packages such as morgan for logging and pug for rendering and mongoDB via atlas for in the 4th project

### How it works (in short)  
The entry point is the server.js file.
Solutions to each of the projects can be found in the projects folder. All the routes and logic defined within this folder are initialized in the server.js file.

### How to run
npm install
npx nodemon ./server.js

### Expected .env variables
PORT - port to server the app
DB_URI - database uri used in project no 4
