const mongoose = require("mongoose");
const User = mongoose.model("user"); //get direct access from DB instead of grabbing from the model.
const Artwork = mongoose.model("artwork"); //get direct access from DB instead of grabbing from the model.


before(done => {
  mongoose.connect("mongodb://localhost/obra_test");

  mongoose.connection
    .once("open", () => mongoose.connection.collections)
    .then(() => User.remove({}))
    .then(() => Artwork.remove({}))
    .then(() => done())
    .catch(() => done())
})
