let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let Day = require("./day");
let menuSchema = new Schema({
    startDate:Date,
    endDate:Date,
    days: [{
        type: Schema.Types.ObjectId,
        ref: "Day"
    }]
});
// here we will declare the static method which will be used to get the menu for the current week
menuSchema.statics.getThisWeekMenu=async function(){
    console.log("Inside getThisWeekMenu");
    // get the current date
    let currentDate=new Date();
    // now we will find the menu whose start date is less than or equal to current date and end date is greater than or equal to current date
    let menu=await this.findOne({
        startDate:{$lte:currentDate},
        endDate:{$gte:currentDate}
    })
    // we will populate everything
    .populate({
        path: "days", // Populate the 'days' array
        model: "Day",
        populate: {
            path: "meals", // Inside each 'Day', populate 'meals'
            model: "Meal",
            populate: {
                path: "items", // Inside each 'Meal', populate 'items'
                model: "Item"
            }
        }
    });
    return menu;
}
let Menu = mongoose.model("Menu", menuSchema);
module.exports=Menu;