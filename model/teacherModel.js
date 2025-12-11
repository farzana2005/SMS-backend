const mongoose = require("mongoose")
const {Schema} = mongoose;

const teacherSchema = new Schema({
    teachername: String,
    departmentname: String,
    teacherid: String,
    phonenumber: String
})

module.exports = mongoose.model("teacher",teacherSchema)