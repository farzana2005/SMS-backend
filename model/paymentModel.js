const mongoose = require("mongoose")
const {Schema} = mongoose;

const paymentSchema = new Schema({
    date:String,
    month:String,
   year:String,
   amount:Number,
    studentname: String,
     trans:Number
});





module.exports = mongoose.model("Payment",paymentSchema)