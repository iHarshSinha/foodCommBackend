const { string } = require("joi")
let mongoose=require("mongoose")
let Item=require("./item")
let Schema=mongoose.Schema
let feastSchema=new Schema({
    name:{
        type:String,
        required:true,
        enum:["breakfast","lunch","snacks","dinner"]
    },
    date:{
        type:String,
        required:true
    },
    items:[
        {
            type:Schema.Types.ObjectId,
            ref:"Item"
        }
    ]
})
feastSchema.methods.getItem=function(id){
    let item = this.items.find(item => item._id.toString() === id.toString());
    return item ? item : null;
}
let Feast=mongoose.model("Feast",feastSchema)
module.exports=Feast