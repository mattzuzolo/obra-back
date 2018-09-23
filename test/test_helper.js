const mongoose = require("mongoose");
const User = mongoose.model("user"); //get direct access from DB instead of grabbing from the model.
const Artwork = mongoose.model("artwork"); //get direct access from DB instead of grabbing from the model.
const Annotation = mongoose.model("annotation")


before(done => {
  mongoose.connect("mongodb://localhost/obra_test");

  mongoose.connection
    .once("open", () => mongoose.connection.collections)
    .then(() => User.remove({}))
    .then(() => Artwork.remove({}))
    .then(() => Annotation.remove({}))
    .then(() => {
      User.create({
        email: "annotation-test@gmail.com",
        password: "123456789"
      })
    })
    .then(() => {
      Artwork.create({
        title: "Guernica",
        artist: "Pablo Picasso",
        medium: "Oil on canvas",
        century: "20th Century",
        culture: "Spanish",
        url: "https://en.wikipedia.org/wiki/Guernica_(Picasso)",
        primaryimageurl: "https://upload.wikimedia.org/wikipedia/en/7/74/PicassoGuernica.jpg",
        id: 99999,
      })
    })
    .then(() => done())
    .catch(() => done())
})
