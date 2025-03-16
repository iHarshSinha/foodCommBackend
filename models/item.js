let mongoose=require("mongoose")
let Schema=mongoose.Schema
let itemSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    numberOfUsers:{
        type:Number,
        default:0
    },
    averageRating:{
        type:Number,
        default:0
    }
})
// here we will make a function that will update the average rating and number of users
itemSchema.methods.updateRating=function(rating){
    let totalRating=this.averageRating*this.numberOfUsers
    totalRating+=rating
    this.numberOfUsers+=1
    this.averageRating=totalRating/this.numberOfUsers
    return this.save()
}
let Item=mongoose.model("Item",itemSchema)
module.exports=Item