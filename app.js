if(process.env.NODE_ENV !="production"){
require('dotenv').config() // for using dotenv file
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");

const path=require("path") // for parsing the data from data base
const methodOverride = require("method-override"); 
const ejsMate=require("ejs-mate") 


// local moulel & core module
 
const ExpressError=require("./utils/ExpressError.js"); // custom Error class 
const listingsRouter=require("./routes/listing.js") // require listing route 
const reviewsRouter=require("./routes/review.js") // require review route 
const userRouter=require("./routes/user.js") // require review route 

const session=require("express-session"); // it is npm packeage, it is used for flash messages and storing info about user in cookies
const MongoStore=require("connect-mongo");
const flash=require("connect-flash") // for display messages and remove after refresh
const passport=require("passport"); // Passport is authentication middleware for Node.js

const LocalStrategy=require("passport-local"); // it define which model used in authentication(here we will use local strategy)
const authRouter=require("./routes/auth.js") // log in with google
const User=require("./models/user.js"); // user schema 

const dburl=process.env.ATLASDB_URL;
main()
.then((res)=>{
console.log("connected to db");

})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dburl);

}

const store= MongoStore.create ({
  mongoUrl:dburl,
  crypto: {
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
  
})
// session option
const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000 ,// it means one week
    httpOnly:true, // true for preventing from  cross scripting attack  
  },

};

app.use(session(sessionOptions)); // for using seesion
app.use(flash()); // use flash 

// for using passport , it is setup
app.use(passport.initialize()); 
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // store info about user kanown as serialized
passport.deserializeUser(User.deserializeUser());// unstore info about user kanown as serialized

// this middleware display the success message on page
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");  // access the message and show on page
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));// parsing data from db
app.use(methodOverride("_method"));// for using put, delete, patch method
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));// for executing static file

app.use("/auth",authRouter)// using auth router
app.use("/listings",listingsRouter); // using listing route("/listings" is common path)
app.use("/listings/:id/reviews",reviewsRouter)// using reviews route
app.use("/", userRouter); // using user router (for sign up, login)

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
})

app.use((err,req,res,next)=>{
   let{statusCode=500,message="something went wrong!"}=err;
  res.status(statusCode).render("error.ejs",{err});

});

app.listen(8080,()=>{
    console.log(`server listen on port 8080`);
    
})
