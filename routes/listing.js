
const express=require("express");
const router=express.Router();

const wrapAsync=require("../utils/wrapAsync.js"); // handling server side error
const ExpressError=require("../utils/ExpressError.js"); // custom Error class 
const Listing = require("../models/listing.js"); 
const {listingSchema}=require("../schema.js"); // for schema validation 
const {isLoggedIn, isOwner}=require("../middleware.js"); // for login authentication 


// backend logic write in this controller folder so require it
const listingController=require("../controllers/listing.js"); 

//  Multer is a node.js middleware for handling multipart/form-data
const multer  = require('multer')// require multer
const {storage}=require("../cloudConfig.js");

const upload = multer({ storage })
// validate listing
const validateListing=(req,res,next)=>{


  let{error}=listingSchema.validate(req.body);
//  console.log(error);
  
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
};

// router.route("/") it is way to write same route in one place instead of writing again and again
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))
  

  //New Route
router.get("/new",isLoggedIn ,listingController.renderNewForm);

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;
