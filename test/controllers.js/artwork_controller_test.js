const { app } = require("../../server");
const mongoose = require("mongoose");
const expect = require("expect");
const request = require("supertest");

const Artwork = mongoose.model("artwork");

describe("Artwork controller", () => {

  //test data
  let title = "Wanderer above the Sea of Fog"
  let artist = "Caspar David Friedrich"
  let medium = "Oil on canvas"
  let century = "19th Century"
  let culture = "German"
  let url = "https://en.wikipedia.org/wiki/Wanderer_above_the_Sea_of_Fog"
  let primaryimageurl = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/600px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg"
  let id = 12345

  it("POST to /artwork creates a new artwork", (done) => {
    Artwork.count().then((count) => {
      request(app)
        .post("/artwork")
        .send({
          title,
          artist,
          medium,
          century,
          culture,
          url,
          primaryimageurl,
          id,
        })
        .expect(200)
        .expect((response) => {
          expect(response.body.title).toBe(title)
          expect(response.body.artist).toBe(artist)
          expect(response.body.medium).toBe(medium)
          expect(response.body.century).toBe(century)
          expect(response.body.culture).toBe(culture)
          expect(response.body.url).toBe(url)
          expect(response.body.primaryimageurl).toBe(primaryimageurl)
          expect(response.body.id).toBe(id)
        })
        .end((error, response) => {
          if(error){
            return done(error);
          }
          Artwork.find().then((artwork) => {
            expect(artwork.length).toBe(1)
            expect(artwork[0].title).toBe(title);
            expect(artwork[0].artist).toBe(artist);
            expect(artwork[0].medium).toBe(medium);
            expect(artwork[0].century).toBe(century);
            expect(artwork[0].culture).toBe(culture);
            expect(artwork[0].url).toBe(url);
            expect(artwork[0].primaryimageurl).toBe(primaryimageurl);
            expect(artwork[0].id).toBe(id);
            done()
          })
          .catch(error => done(error));
        });

    })
  })

})
