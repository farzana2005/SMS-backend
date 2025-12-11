const mongoose = require("mongoose")
const {Schema} = mongoose;

const leaveSchema = new Schema({
    studentname: String,
    departmentname: String,
    studentid: String,
    total: Number
  
})

module.exports = mongoose.model("Leave",leaveSchema)