const UserController = require("../controllers/user_controller");
const { authenticate } = require("../middleware/authenticate");



module.exports = (app) => {
  //user endpoints
  app.get("/users", UserController.index);
  app.get("/users/:id", UserController.findIndividualById);
  app.get("/current", UserController.findIndividualByToken)
  app.post("/users", UserController.create);
  app.post("/users/login", UserController.login);
  app.delete("/users/me/token", authenticate, UserController.logout);
}





// const ArtworkController = require("../controllers/artwork_controller")
// const AnnotationController = require("../controllers/annotation_controller")

  //artwork endpoints
  // app.get("/artwork", ArtworkController.index);
  // app.get("/artwork/:id", ArtworkController.findArtworkById);
  // app.post("/artwork", ArtworkController.create);


  //annotation endpoints
  // app.get("/annotations", AnnotationController.index);
  // app.get("/annotations/:id", AnnotationController.findAnnotationById
  // app.get("/me/annotations", AnnotationController.findLoggedInAnnotations)
  // app.get("/annotations-artwork", AnnotationController.findAnnotationsWithArtwork);
  // app.get("/annotations-user", AnnotationController.findAnnotationsWithUser);
  // app.post("/annotations", authenticate, AnnotationController.create);
  // app.put("/annotations/:id", authenticate AnnotationController.update);
  // app.delete("/annotations/:id", authenticate AnnotationController.delete);
