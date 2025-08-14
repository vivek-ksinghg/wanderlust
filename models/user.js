const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose"); // for user authentication with mongoose, it automaticaly add username,hash and salt field to the store username


const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(passportLocalMongoose); // plugin for ading salting, hashing, useraname , password implicitly , 

module.exports=mongoose.model('User',userSchema);