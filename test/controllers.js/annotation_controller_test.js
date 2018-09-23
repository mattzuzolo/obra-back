const { app } = require("../../server");
const mongoose = require("mongoose");
const expect = require("expect");
const request = require("supertest");

const Annotation = mongoose.model("annotation");

describe("Annotation controller", () => {

  let sampleAnnotation = {
    headline: "Test headline",
    content: "Test content",
    source: "Test source",
    xCoord: 500,
    yCoord: 501,
    user: [{
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    }], //must reference entire collection as listed in respective schema
    artwork: [{
      type: Schema.Types.ObjectId,
      ref: 'artwork',
      required: true
    }],

  }




})
