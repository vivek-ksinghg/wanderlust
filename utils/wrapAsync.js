// wrapAsync function is function which is take function as argument and also return function
module.exports= (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
 };