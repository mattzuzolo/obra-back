const mongoose = require("mongoose");

before(done => {
  mongoose.connect("mongodb://localhost/obra_test");

  mongoose.connection
    .once("open", () => done())
    .on("error", error => {
      console.warn("Warning", error);
    })
})

// beforeEach(done => {
//   const { users } = mongoose.connection.collections;
//   users.drop()
//     .then(() => done())
//     .catch(() => done())
// })
