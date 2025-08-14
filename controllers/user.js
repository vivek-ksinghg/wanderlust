const User=require("../models/user");


// sign up form render
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

// submit sign up form
module.exports.signup=async(req,res)=>{
 try{   
  let{username,email,password}=req.body;
  const newUser=new User({email,username});

   const registeredUser=await User.register(newUser,password);

   req.login(registeredUser,(err)=>{ // login() is passport method, this login method use for after sign up, login automatically ho jaye
    if(err){
        return next(err);
    }
    req.flash("success","Welcome to WanderLust!");
    res.redirect("/listings");
});
  
 }catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
 }
}

// render login form
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

// submit login form
module.exports.login=async(req,res)=>{

    // passport.authenticate() is a middleware , jo hamko authenticate karega ki user pahle se login hai ki nahi
    // failureFlash:true;means if authentication fail then flash message display
    
    req.flash("success","welcome to wandlust!,you are logged in!")
   
    // ham chahte hai ki user jis page par jaye , waha se ho login krne ki liye jata hai ,login karne ke ad wapas usi page par aaye na ki listing par jaye
    let redirectUrl=res.locals.redirectUrl || "/listings"; // it is for when we are login from home page 
    res.redirect(redirectUrl);
    
    
}

// log out 
module.exports.logout=(req,res)=>{
    req.logOut((err)=>{ // passport has logout method, which take ccallback
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings")
    })
}    