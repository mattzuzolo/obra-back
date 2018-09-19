const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

//establish schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email!!!`,
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }]
});

//modify JSON return only neccessary information
UserSchema.methods.toJSON = function(){
  let user = this;
  let userObject = user.toObject(); //mongoose user variable and limiting properties avaialble
  //only returns _id and email
  return (({ _id, email }) => ({ _id, email }))(userObject);

};

//instance methods
UserSchema.methods.generateAuthToken = function(){
  // console.log("INSIDER GENERATE AUTH METHOD")
  let user = this;
  let access = "auth";
  let token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  //Issues using .push() depending on mongo version
  //will change to spread operator or other solution later
  user.tokens = user.tokens.concat([{access,token}]);
  return user.save()
    .then(() => {
      // console.log("RETURN TOKEN HERE")

      return token;
    });
};

UserSchema.methods.removeToken = function(token){
  let user = this;
  return user.update({
    $pull: {
      tokens: {token}
    }
  })
};

//Model methods
UserSchema.statics.findByToken = function(token){
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  } catch(error){
    return Promise.reject();
  }

  return User.findOne({
    "_id": decoded._id,
    "tokens.token": token,
    "tokens.access": "auth",
  });
};
//comment
UserSchema.statics.findByCredentials = function(email, password){
  let User = this;
  return User.findOne({email})
    .then((user) => {
      if (!user){
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (error, response) => {
          if(response){
            resolve(user);
          }
          else {
            reject();
          }
        })
      });
    });
}

UserSchema.pre("save", function(next){
  let user = this;
  if (user.isModified("password")){
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      });
    })
  } else {
    next();
  }
});

//Create model. First argument is singlular name for collection.
const User = mongoose.model("user", UserSchema);

module.exports = { User };
