let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ReviewSchema = new Schema({
    date: {
        type: Date
    },
    rating: {
        type: Number,
        required: true
    },
    feedback: {
        type: String
    },
    image:{
        type:String
    }
});
let Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
