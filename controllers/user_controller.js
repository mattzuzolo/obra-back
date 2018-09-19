const { User } = require("../models/user");
const { ObjectID } = require("mongodb");

module.exports = {
  //find all users
  index(request, response, next){
    //use find method to access all users (add no filtering object for all)
    User.find({})
      .then(users => response.send({users}))
      .catch(next);
  },

  // find individual user by id
  findIndividualById(request, response, next){
    let id = request.params.id;
    //check if ObjectId is valid before proceeding — or return a 404
    if (!ObjectID.isValid(id)){
      return response.status(404).send();
    }
    //search db for user using provided ID
    User.findById(id)
      .then((user) => {
        if(!user){
          return response.status(404).send();
        }
        response.send({user});
      })
      .catch(next);
  },

  //check for current user via the token saved in localStorage
  findIndividualByToken(request, response, next){
    let token = request.get("x-auth")
      // if (!ObjectID.isValid(id)){
      //   return response.status(404).send();
      // }
      User.findByToken(token)
        .then((user) => {
          if(!user){
            return response.status(404).send();
          }
        response.send({user});
      })
      .catch(next);
  },
  create(request, response, next){
    let body = (({ email, password }) => ({ email, password }))(request.body);

    let user = new User(body);
    user.save()
      .then(() => user.generateAuthToken())
      .then((token) => response.header("x-auth", token).send(user))
      .catch(event => response.status(400).send(event))
  },
  login(request,response, next){
    let body = (({ email, password }) => ({ email, password }))(request.body);

    User.findByCredentials(body.email, body.password)
      .then((user) => {
        // console.log("INSIDE FIND BY CREDENTIALS")
        return user.generateAuthToken().then((token) => {
          let userWithToken = Object.assign({}, user, {"token": token})
          // console.log("ABOUT TO SEND userWithToken", userWithToken)
          // response.header("x-auth", token).send(user);
          // console.log("userWithToken", userWithToken)

          response.send(userWithToken)
        });
      }).catch((error) => {
        response.status(400).send();
      });
  },

};
