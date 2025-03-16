let Menu=require("../models/menu")
let Meal=require("../models/meal")
let Item=require("../models/item")

let mongoose = require("mongoose")
let ExpressError = require("../utils/ExpressError");
let twilio = require('twilio');
let { cloudinary, storage } = require("../cloudinary/index")
let multer = require("multer")
let upload = multer({ storage })
let Feast = require("../models/feast");
let validateDateFormat = require("../utils/validateDateFormat");
let Review = require("../models/review");
let client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
module.exports.getMenu = async (req, res, next) => {
    
    // we will see the current date and then get the menu whose start date is before current date and end date is after current date
    // this will be a static method in the Menu model
    let menu = await Menu.getThisWeekMenu();
    // now we will send json response
    console.log(menu);
    console.log("i am sending data")
    res.json(menu);
}
module.exports.sick = async (req, res, next) => {
    console.log("got request");
    // we have name of the user, room number, meal type, start date, end date, instructions, meals
    // now we will construct a whatsapp message that we will send to the manager
    // we will send the message to the manager using twilio
    // first lets check if instructions field is there or not
    let { name, room, mealType, startDate, endDate, instructions, meals } = req.body;
    let message = `Name: ${name}\nRoom: ${room}\nMeal Type: ${mealType}\nStart Date: ${startDate}\nEnd Date: ${endDate}\n`;
    message += `Meals:\n`;
    for (let meal of meals) {
        message += `${meal}\n`;
    }
    if (instructions) {
        message += `Instructions: ${instructions}\n`;
    }
    
    console.log(message);
    let managerNumber = process.env.MANAGER_NUMBER;
    let adminNumber = process.env.ADMIN_NUMBER;
    let sendMessage= await client.messages.create({
        body: message,
        from: "whatsapp:"+adminNumber,
        to: "whatsapp:"+managerNumber
    });
    console.log(sendMessage.sid);
    return res.json({message:"Sick Meal Request Sent"});   
}
module.exports.updateRating = async (req, res, next) => {
    console.log(req.body);
    
    let mealId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(mealId)) {
        return next(new ExpressError("Invalid Meal Id", 400));
    }
    let CurrentMeal = await Meal.findById(mealId).populate("items");
    // now in body we have rating as an array of objects with item id and rating of those individual items
    let { Rating } = req.body;
    if(!Rating){
        return next(new ExpressError("Rating is required", 400));
    }
    console.log(Rating);
    for (let rate of Rating) {
        console.log("loop");
        // check for valid item id
        if (!mongoose.Types.ObjectId.isValid(rate.itemId)) {
            return next(new ExpressError("Invalid Item Id", 400));
        }
        let item = await CurrentMeal.getItem(rate.itemId);
        console.log(item);
        if (!item) {
            return next(new ExpressError("Invalid Item Id", 400));
        }
        // here we will call  that method which will update the rating and the number of user
        await item.updateRating(rate.rating);
        
    }
    return res.json({ message: "Rating Updated" });
}
module.exports.getFeast = async (req, res, next) => {
    let {date,meal}=req.query;
    if(!date || !meal){
        return next(new ExpressError("Date and meal are required",400));
    }
    // now date must be in the form of dd three letter month and yy
    if(!validateDateFormat(date)){
        return next(new ExpressError("Invalid date format",400));
    }
    // meal must be breakfast,lunch,snacks or dinner
    if(meal!="breakfast" && meal!="lunch" && meal!="snacks" && meal!="dinner"){
        return next(new ExpressError("Invalid meal",400));
    }
    let feast=await Feast.findOne({date:date,name:meal}).populate("items");
    if(!feast){
        return next(new ExpressError("No feast found",404));
    }
    return res.json(feast);
}

module.exports.addReview = async (req, res, next) => {
    // now we will get image from path
    // we will upload the image to cloudinary
    // we will get the secure url of the image
    // we will save the review with this secure url

    let {rating,feedback}=req.body;
    console.log(req.file,"this is req.file");
    if(req.file){
        let image=req.file.path;
        let secureUrl=await cloudinary.uploader.upload(image);
        // date will be current date
        let review=new Review({
            date:new Date(),
            rating,
            feedback,
            image:secureUrl.secure_url
        });
        await review.save();
        return res.json({message:"Review Added"});
    }
    else{
        let review=new Review({
            date:new Date(),
            rating,
            feedback
        }); 
        await review.save();
        return res.json({message:"Review Added"});
    }

}
module.exports.updateFeastRating = async (req, res, next) => {
    let feastId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(feastId)) {
        return next(new ExpressError("Invalid Feast Id", 400));
    }
    let feast = await Feast.findById(feastId).populate("items");
    if (!feast) {
        return next(new ExpressError("Could not find feast", 400));
    }
    // now get the rating from the body
    let { Rating } = req.body;
    if (!Rating) {
        return next(new ExpressError("Rating is required", 400));
    }
    // now we will update the rating of the feast
    // now we will iterate over the items and update the rating
    for (let rate of Rating) {
        console.log("loop");
        // check for valid item id
        if (!mongoose.Types.ObjectId.isValid(rate.itemId)) {
            return next(new ExpressError("Invalid Item Id", 400));
        }
        let item = await feast.getItem(rate.itemId);
        console.log(item);
        if (!item) {
            return next(new ExpressError("Invalid Item Id", 400));
        }
        // here we will call  that method which will update the rating and the number of user
        await item.updateRating(rate.rating);
        
    }
    return res.json({ message: "Rating Updated" });
}
