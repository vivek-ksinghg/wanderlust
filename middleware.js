const Listing=require("./models/listing");
const Review=require("./models/review");
// this middleware is use for checking to user login or not before creating new listing
module.exports.isLoggedIn=(req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl; // save original url of user 
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

// this midlleware is create because req.session.redirectUrl is lost when user login , passport refersh the session after login so session is empty 
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

/* this middleware check who is owner of listing ,example for understand this middleware:-> if current user is owner of listing then 
able to edit, delete that listing otherwise not ,it function of this middleware */

module.exports.isOwner=async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
     req.flash("error","you are not owner of this listing");
     return res.redirect(`/listings/${id}`);
    }
 next();
};

// this middleware check who is author of review 
module.exports.isReviewAuthor=async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
     req.flash("error","you are not author of this review");
     return res.redirect(`/listings/${id}`);
    }
 next();
};