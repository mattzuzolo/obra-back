const { Artwork } = require("../models/artwork");
const { ObjectID } = require("mongodb");

module.exports = {
  
  index(request, response, next){
    Artwork.find({})
      .then(artwork => response.send({artwork}))
      .catch(next);
  },

  findArtworkById(request, response, next){
    let id = request.params.id;
    //search db for external API id. Not Mongo _id.
    Artwork.findOne({id})
      .then((artwork) => {
        if(!artwork){
          return response.status(404).send();
        }
        response.send({artwork})
      })
      .catch(next);
  },

  create(request, response, next){
    let artwork = new Artwork({
      title: request.body.title,
      artist: request.body.artist,
      medium: request.body.medium,
      century: request.body.century,
      culture: request.body.culture,
      url: request.body.url,
      primaryimageurl: request.body.primaryimageurl,
      id: request.body.id,
    });
    //save to DB or deny entry
    artwork.save()
      .then((doc) => response.send(doc))
      .catch(next);
  },
};
