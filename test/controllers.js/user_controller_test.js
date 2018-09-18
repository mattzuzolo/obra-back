const { app } = require("../../server");
const mongoose = require("mongoose");
const expect = require("expect");
const request = require("supertest");

const User = mongoose.model("user"); //get direct access from DB instead of grabbing from the model.

describe("User controller", () => {

  it("POST to /users creates a new user", (done) => {
    User.count().then((count) => {
      request(app)
        .post("/users")
        .send({
          email: "test@gmail.com",
          password: "123456789"
       })
       .end(() => {
         User.count().then(newCount => {
           expect(count + 1 === newCount);
           done();;
         });
       });
    });
  });

  it("GET to /users returns all users", (done) => {
    User.count().then((count) => {
      request(app)
        .get("/users")
        .expect(200)
        .expect((response) => {
          expect(response.body.users.length).toBe(1);
        })
        .end(done);
    });
  });

})
