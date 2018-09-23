const { app } = require("../../server");
const mongoose = require("mongoose");
const expect = require("expect");
const request = require("supertest");

const Artwork = mongoose.model("artwork");

describe("Artwork controller", () => {

  let sampleArtwork = {
    title: "Wanderer above the Sea of Fog",
    artist: "Caspar David Friedrich",
    medium: "Oil on canvas",
    century: "19th Century",
    culture: "German",
    url: "https://en.wikipedia.org/wiki/Wanderer_above_the_Sea_of_Fog",
    primaryimageurl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/600px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg",
    id: 12345,
  }

  it("POST to /artwork creates a new artwork", (done) => {
    Artwork.count().then((count) => {
      request(app)
        .post("/artwork")
        .send(sampleArtwork)
        .expect(200)
        .expect((response) => {
          expect(response.body.title).toBe(sampleArtwork.title)
          expect(response.body.artist).toBe(sampleArtwork.artist)
          expect(response.body.medium).toBe(sampleArtwork.medium)
          expect(response.body.century).toBe(sampleArtwork.century)
          expect(response.body.culture).toBe(sampleArtwork.culture)
          expect(response.body.url).toBe(sampleArtwork.url)
          expect(response.body.primaryimageurl).toBe(sampleArtwork.primaryimageurl)
          expect(response.body.id).toBe(sampleArtwork.id)
        })
        .end((error, response) => {
          if(error){
            return done(error);
          }
          Artwork.find().then((artwork) => {
            expect(artwork.length).toBe(2)
            expect(artwork[1].title).toBe(sampleArtwork.title);
            expect(artwork[1].artist).toBe(sampleArtwork.artist);
            expect(artwork[1].medium).toBe(sampleArtwork.medium);
            expect(artwork[1].century).toBe(sampleArtwork.century);
            expect(artwork[1].culture).toBe(sampleArtwork.culture);
            expect(artwork[1].url).toBe(sampleArtwork.url);
            expect(artwork[1].primaryimageurl).toBe(sampleArtwork.primaryimageurl);
            expect(artwork[1].id).toBe(sampleArtwork.id);
            done()
          })
          .catch(error => done(error));
        });

    })
  })

  it("GET to /artwork/:id returns a specific artwork by id", (done) => {
    request(app)
      .get(`/artwork/${sampleArtwork.id}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.artwork.id).toBe(sampleArtwork.id);
      })
      .end(done);
  })

  it("GET to /artwork returns all artworks", (done) => {
    Artwork.count().then((count) => {
      request(app)
        .get("/artwork")
        .expect(200)
        .expect((response) => {
          // console.log("response.body", response.body)
          expect(response.body.artwork[1].title).toBe(sampleArtwork.title)
          expect(response.body.artwork.length).toBe(2);
        })
        .end(done);
    })
  })

})
