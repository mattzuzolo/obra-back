require('./config/config');

//require external libraries
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const { mongoose } = require("./db/mongoose");
// const { ObjectID } = require("mongodb");
const app = express();

const routes = require("./routes/routes");



//require local imports
let { User } = require("./models/user");
// let { Annotation } = require("./models/annotation");
// let { Artwork } = require("./models/artwork");
let { authenticate } = require("./middleware/authenticate");

//Save express to app

//Assign port. Default to Heroku config or run 4000 locally
const PORT = process.env.PORT || 4000;

//configure middleware:
app.use(cors());
app.use(bodyParser.json());

routes(app);

app.use((error, request, response, next) => {
  response.status(422).send({ error: error.message });
});


//Listen on the chosen port
app.listen(PORT, () => {
  console.log(`Started on port ${PORT}.`);
})

module.exports = { app };








//GET annotations
app.get("/annotations", (request, response) => {
  //use find method to access all users

  Annotation.find({}).then((annotations) => {
    response.send({annotations});
  }, (error) => {
    response.status(400).send(error);
  });
});
 ////
app.get("/me/annotations", authenticate, (request, response) => {
  //use find method to access all users
  Annotation.find({
    user: request.user._id
  })
  .populate("artwork")
  .populate("user")
  .then((annotations) => {
    response.send({annotations});
  }, (error) => {
    response.status(400).send(error);
  });
});

//GET annotations by id
app.get("/annotations/:id", (request, response) => {
  let id = request.params.id;

  if (!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  Annotation.findById(id).then((annotation) => {
    if(!annotation){
      return response.status(404).send();
    }
    response.send({annotation});
  }).catch((error) => {
    response.status(400).send();
  });
});


//GET annotations by with artwork object
app.get("/annotations-artwork", (request, response) => {
  Annotation.find({})
    .populate("artwork")
    .then((annotation) => {
    if(!annotation){
      return response.status(404).send();
    }
    response.send({annotation});
  }).catch((error) => {
    response.status(400).send();
  });
});











//GET annotations by with artwork object
app.get("/annotations-user", (request, response) => {
  Annotation.find({})
    .populate("user")
    .then((annotation) => {
    if(!annotation){
      return response.status(404).send();
    }
    response.send({annotation});
  }).catch((error) => {
    response.status(400).send();
  });
});


//POST annotation
app.post("/annotations", authenticate, (request, response) => {
  // console.log("Request at /annotations POST: ", request.body);
  let annotation = new Annotation({
    headline: request.body.headline,
    content: request.body.content,
    source: request.body.source,
    xCoord: request.body.xCoord,
    yCoord: request.body.yCoord,
    artwork: request.body.artwork,
    user: request.body.user,
    // user: request.user._id,
  });

  // console.log("Request at /annotations POST: ", request.body);
  // console.log(request.body);

  annotation.save().then((doc) => {
    response.send(doc);
  }, (error) => {
    response.status(400).send(error);
  });
});






//UPDATE annotation
app.put("/annotations/:id", authenticate, (request, response) => {
  let id = request.params.id; //annotation id
  let body = request.body;


  if (!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  Annotation.findOneAndUpdate({_id: id}, request.body, {new: true})
    .then((annotation) => {
      if (!annotation) {
        return response.status(404).send();
      }

      response.send({annotation})

    }).catch((error) => {
      response.send(400).send();
    })
});









//DELETE annotation
app.delete("/annotations/:id", authenticate, (request, response) => {
  let id = request.params.id;

  if (!ObjectID.isValid(id)){
    return response.status(404).send();
  }

  Annotation.findOneAndRemove({
    _id: id,
    user: request.user._id,
  }).then((annotation) => {
    if (!annotation){

      return response.status(404).send();
    }
    response.send(annotation);
  }).catch((error) => {
    response.status(400).send();
  });
});
