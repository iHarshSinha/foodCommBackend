let mongoose=require("mongoose")
let Item=require("./item")
let Schema=mongoose.Schema
let mealSchema=new Schema({
    name:{
        // it will be string but can only be breakfast,lunch,snacks,dinner
        type:String,
        required:true,
        enum:["breakfast","lunch","snacks","dinner"]
    },
    items:[{
        type:Schema.Types.ObjectId,
        ref:"Item"
    }],
    // now there will be a property known as isFeast which will be true if the meal is feast and will also contain the date of the feast but the date will be in string format dd three letter month and yy
    isFeast: {
        status: {
            type: Boolean,
            default: false
        },
        date: {
            type: String,
            default: "" // Format: dd three-letter month yy (e.g., "12 Jan 25")
        }
    }
})

// we will create a method which will return the item stored in this meal and we will pass the id here
mealSchema.methods.getItem=function(id){
    let item = this.items.find(item => item._id.toString() === id.toString());
    return item ? item : null;
}
let Meal=mongoose.model("Meal",mealSchema)
module.exports=Meal