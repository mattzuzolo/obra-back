require('./config/config');

//require external libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();

//require local files
const { mongoose } = require("./db/mongoose");
const routes = require("./routes/routes");

//Assign port. Default to Heroku config or run 4000 locally
const PORT = process.env.PORT || 4000;

//configure middleware:
app.use(cors());
app.use(bodyParser.json());
routes(app);
app.use((error, request, response, next) => {
  response.status(422).send({ error: error.message });
});

//Listen on the specified port
app.listen(PORT, () => {
  console.log(`Started on port ${PORT}.`);
})

module.exports = { app };
