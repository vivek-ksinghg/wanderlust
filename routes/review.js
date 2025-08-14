// THIS IS OUR REVIEW ROUTE (ALL LISTING RALATED ROUTE HERE)

const express=require("express");
const router=express.Router({mergeParams:true});

// local moulel
const wrapAsync=require("../utils/wrapAsync.js"); // handling server side error
const ExpressError=require("../utils/ExpressError.js"); // custom Error class 
const { reviewSchema}=require("../schema.js"); // for schema validation 
const Listing = require("../models/listing.js"); // local module
const Review=require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


const reviewController=require("../controllers/review.js") // require review controller

// review validation(joi validation)
const validateReview=(req,res,next)=>{
  let{error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message.join(","));
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}



// review
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview))


// delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports=router;
