// in this file , we are write the logic of intiliazation of data base

const initData = require("./data");
const mongoose =   require("mongoose");
const Listing = require("../models/listing");


// connect data base

main()
.then((res)=>{
console.log("connected to db");

})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlst');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner: "67ee107acc94a49ff8f0a0d4" })) // adding owner property
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();