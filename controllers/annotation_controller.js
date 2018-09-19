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

  // findLoggedInAnnotations(request, response, next){
  //
  // },
  //
  // findAnnotationsWithUser(request, response, next){
  //
  // },
  //
  // findAnnotationsWithArtwork(request, response, next){
  //
  // },
  //
  // create(request, response, next){
  //
  // },
  //
  // update(request, response, next){
  //
  // },
  //
  // delete(request, response, next){
  //
  // },

};
