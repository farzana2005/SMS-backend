const mongoose = require("mongoose")
const {Schema} = mongoose;

// const resultSchema = new Schema({
//     studentid:String,
//     departmentname: String,
//     result: [{
//         subject:String,
//         result:String
//     }],
//     cgpa:Number
  
// })


const resultSchema = new Schema({
  studentid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  departmentname: String,
  result: [{
    subject: String,
    result: String
  }],
  cgpa: Number
});


module.exports = mongoose.model("Result",resultSchema)