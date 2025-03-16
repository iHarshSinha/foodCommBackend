let JoiSchema = require("./joiSchema");
let ExpressError=require("./utils/ExpressError")
module.exports.validateSickMeal=async (req,res,next)=>{
    let validateSickSchema=JoiSchema.sickMeal;
    let result=validateSickSchema.validate(req.body);
    if(result.error){
        let message=result.error.details.map(el=>el.message).join(",");
        console.log(message);
        return next(new ExpressError(message,400));
    }
    return next();
}