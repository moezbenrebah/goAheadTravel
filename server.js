const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// catch uncaught exception handler
process.on('uncaughtException', error => {
  console.log(error.name, error.message);
  process.exit(1);
});

dotenv.config();

const DataBase = process.env.DATABASE.replace(
  '<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose.connect(DataBase, {useNewUrlParser: true}).then(() => console.log('DB Established ...'));	

const port = process.env.PORT || 5000;

// START SERVER
const server = app.listen(port, () => console.log(`App running on ${port} ...`));

// catch unhandled rejection handler
process.on('unhandledRejection', error => {
  // log the error detail
  console.log(error.name, error.message);
  // close the server with taking into consideration the ongoing requests
  server.close(() => {
    process.exit(1);
  });
});
