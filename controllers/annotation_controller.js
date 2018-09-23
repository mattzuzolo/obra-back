const { Annotation } = require("../models/annotation");
const { ObjectID } = require("mongodb");

module.exports = {

  index(request, response, next){
    Annotation.find({})
      .then(annotations => response.send({annotations}))
      .catch(next);
  },

  findAnnotationById(request, response, next){
    let id = request.params.id;

    if (!ObjectID.isValid(id)){
      return response.status(404).send();
    }

    Annotation.findById(id)
      .then((annotation) => {
        if(!annotation){
          return response.status(404).send();
        }
        response.send({annotation});
      })
      .catch(next);
  },

  findAnnotationsWithUser(request, response, next){
    Annotation.find({})
      .populate("user")
      .then((annotation) => {
        if(!annotation){
          return response.status(404).send();
        }
        response.send({annotation});
      })
      .catch(next);
  },

  findAnnotationsWithArtwork(request, response, next){
    Annotation.find({})
      .populate("artwork")
      .then((annotation) => {
        if(!annotation){
          return response.status(404).send();
        }
        response.send({annotation});
      })
      .catch(next);
  },

  create(request, response, next){
    let annotation = new Annotation({
      headline: request.body.headline,
      content: request.body.content,
      source: request.body.source,
      xCoord: request.body.xCoord,
      yCoord: request.body.yCoord,
      artwork: request.body.artwork,
      user: request.body.user,
    });

    annotation.save()
      .then((doc) => response.send(doc))
      .catch(next);
  },

  update(request, response, next){
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
      })
      .catch(next);
  },

  delete(request, response, next){
    let id = request.params.id;
    if (!ObjectID.isValid(id)){
      return response.status(404).send();
    }

    Annotation.findOneAndRemove({
      _id: id,
      user: request.user._id,
    })
      .then((annotation) => {
        if (!annotation){
          return response.status(404).send();
        }
        response.send(annotation);
      })
      .catch(next);
  },

  findLoggedInAnnotationsWithUserAndArtwork(request, response, next){
    Annotation.find({ user: request.user._id })
      .populate("artwork")
      .populate("user")
      .then((annotations) => {
        response.send({annotations});
      })
      .catch(next);
  },

};
