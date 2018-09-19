const { Artwork } = require("../models/artwork");
const { ObjectID } = require("mongodb");

module.exports = {
  index(request, response, next){
    Artwork.find({})
      .then(users => response.send({users}))
      .catch(next);
  },

  findArtworkById(request, response, next){

  },

  create(request, response, next){

  },
};
