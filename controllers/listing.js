const Listing=require("../models/listing");

//Index Route
module.exports.index=async (req, res) => {

  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

//New Route
module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
}

// show route( in crud read)
module.exports.showListing=async(req,res)=>{
  let {id}=req.params // fetch id 
  const listing = await Listing.findById(id)
  .populate({ // we are using here populate nesting for diplay the author of review on show page
    path:"reviews",
    populate:{
        path:"author",
    }
})
  .populate("owner");

  if(!listing){
    req.flash("error","this listing does not exist");
    res.redirect("/listings");
  }
  
  res.render("listings/show.ejs",{listing});
}


// create route
module.exports.createListing=async(req,res)=>{
  let url=req.file.path; // extract url of image
  let filename=req.file.filename; // extract file name of image
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  await newListing.save();
  req.flash("success","New Listing is Created!"); // show flash when new lising created
  res.redirect("/listings");

}

// edit route
module.exports.renderEditForm=async(req,res)=>{
  let{id}=req.params;
  let listing= await Listing.findById(id);
  if(!listing){
    req.flash("error","this listing does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl= originalImageUrl.replace("/upload","/upload/h_300,w_250");
  req.flash("success"," Listing edit!");
  res.render("listings/edit.ejs", { listing,originalImageUrl });
}


// update route
module.exports.updateListing= async (req, res) => {

    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if( typeof req.file !== "undefined"){
    let url=req.file.path; // extrct url of image
    let filename=req.file.filename; // extract file name of image
    listing.image={url,filename};
    await listing.save();
   }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }


//Delete Route
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  }
