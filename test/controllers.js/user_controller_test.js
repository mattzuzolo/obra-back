const { app } = require("../../server");
const mongoose = require("mongoose");
const expect = require("expect");
const request = require("supertest");

const User = mongoose.model("user"); //get direct access from DB instead of grabbing from the model.

describe("User controller", () => {

  //test data
  let email = "matt@gmail.com"
  let password = "123456789"
  let createdUserId;
  let createdUserToken;

  it("POST to /users creates a new user", (done) => {
    User.count().then((count) => {
      request(app)
        .post("/users")
        .send({ email, password })
        .expect(200)
        .expect((response) => {
          expect(response.body.email).toBe(email);
        })
        .end((error, response) => {
          if(error){
            return done(error);
          }
          User.find().then((users) => {
            expect(users.length).toBe(1);
            expect(users[0].email).toBe(email)
            done();
          })
          .catch(error => done(error))
        });
    });
  });


  it("POST to /users/login logins a user and provides a token", (done) => {
    request(app)
      .post("/users/login")
      .send({ email, password })
      .expect((response) => {
        createdUserId = response.body._doc._id;
        createdUserToken = response.body.token;
        expect(response.body.token).toExist();
      })
      .end((error, response) => {
        if(error){
          return done(error)
        }
        done();
      })
  });

  it("GET to /users/:id to find a specific user by _id", (done) => {
    request(app)
      .get(`/users/${createdUserId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.user.email).toBe(email);
      })
      .end(done);
  })

  it("GET to /current to check which user is currently logged in", (done) => {
    request(app)
      .get("/current")
      .set("x-auth", createdUserToken)
      .expect(200)
      .expect((response) => {
        expect(response.body.user.email).toBe(email);
      })
      .end(done);
  })


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
