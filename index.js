const express = require ('express')
const mongoose = require('mongoose');
const User = require("./model/usermodel");
const Student =require("./model/studentModel")

const usermodel = require('./model/usermodel');
var cors = require('cors')
const app = express()
const multer  = require('multer');
const bookModel = require('./model/bookModel');
const Leave = require("./model/leaveModel");
const Result = require("./model/resultModel");
const axios = require("axios")
const Payment = require('./model/paymentModel');
const Teacher = require("./model/teacherModel");
//const { default: Teacher } = require('../Frontend/src/pages/Teacher');


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'))

 

mongoose.connect('mongodb+srv://admin:admin@cluster0.tnxgtsv.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected!'));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null,uniqueSuffix + '-' +  file.originalname  );
    console.log(file)
  },
});

const upload = multer({ storage: storage })



// app.post('/uploadbook', upload.single('avatar'), function (req, res, next) {
//   console.log("hello")
//   let book = new bookModel({
//     name:req.body.name,
//     departmentname:req.body.departmentname,
//     writer:req.body.writer,
//     serial:req.body.serial,
//     url:req.file.path

//   }).save()

//  res.send("Book uploaded")

// });

app.post('/uploadbook', upload.single('avatar'), async (req, res) => {
  try {
    const savedBook = await new bookModel({
      name: req.body.name,
      departmentname: req.body.departmentname,
      writer: req.body.writer,
      serial: req.body.serial,
      url: req.file.filename     // শুধু filename save করবে
    }).save();

    res.json(savedBook);  // React কে full ডেটা ফেরত পাঠানো জরুরি

  } catch (error) {
    console.log(error);
    res.status(500).send("Upload failed");
  }
});



// app.get("/allbook",async (req,res)=>{
// let data = await bookModel.find({})
// res.send(data)
// })

app.get("/allbook", async (req, res) => {
  const data = await bookModel.find();
  res.json(data);
});




app.post('/registration',async (req, res) => {
  console.log(req.body)

   let isUserExists = await User.findOne({email:req.body.email})

   if(isUserExists){
     return res.send(`${req.body.email} already exists`)
   }




  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password 
  }).save()
  
   res.send('Registration successfull')
})





app.post('/login',async (req, res) => {
  console.log(req.body)

   let isUserExists = await User.findOne({email:req.body.email})

   if(!isUserExists){
     return res.send(`${req.body.email} not found`)
   }

    if(isUserExists.password !== req.body.password){
       return res.send(`Invalid credential`)
    }
  
   res.send({
    username: isUserExists.username,
    email: isUserExists.email
   })
})

{/* Teacher Start */}

app.post('/createteacher', async (req, res) => {

  const newTeacher = new Teacher({
      teachername:req.body.teachername,
      departmentname:req.body.departmentname,
      teacherid:req.body.teacherid,
      phonenumber:req.body.phonenumber

  });
  await newTeacher.save();
  res.send("Teacher Created");
  
});



app.get('/allteacher', async (req, res) => {
  try {
    const data = await Teacher.find({}); // সব student আনবে
    console.log("All teachers:", data);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching teachers");
  }
});



//app.get('/allstudent', async (req, res) => {
   // console.log(req.params.id)
 //let data = await Student.find({_id:req.params.id})
 // res.send(data)
//});


app.get('/teacher/:id',async (req, res) => {
console.log(req.params.id)
 let data = await Teacher.find({_id:req.params.id})
  res.send(data)
})


// app.patch('/teacher/:id',async (req, res) => {
// console.log(req.params.id)
//  let data = await Teacher.findByIdAndUpdate({_id:req.params.id},
//   {
//       teachername:req.body.teachername,
//       departmentname:req.body.departmentname,
//       teacherid:req.body.teacherid,
//       phonenumber:req.body.phonenumber,

//  })
//   res.send(data);
// });

app.patch('/teacher/:id', async (req, res) => {
  try {
    console.log("Updating ID:", req.params.id);
    console.log("BODY:", req.body);

    let data = await Teacher.findByIdAndUpdate(
      req.params.id,       // ✅ শুধু id
      {
        teachername: req.body.teachername,
        departmentname: req.body.departmentname,
        teacherid: req.body.teacherid,
        phonenumber: req.body.phonenumber,
      },
      { new: true }         // ✅ আপডেট হওয়া নতুন ডাটা দেখাবে
    );

    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Update error");
  }
});







app.post('/delete',async (req, res) => {

 let data = await Teacher.findByIdAndDelete({_id: req.body.id})
  res.send("Deleted")
});




{/* Teaacher close */}







app.post('/createstudent', async (req, res) => {

  const newStudent = new Student({
      studentname:req.body.studentname,
      departmentname:req.body.departmentname,
      studentid:req.body.studentid,
      phonenumber:req.body.phonenumber

  });
  await newStudent.save();
  res.send("Student Created");
  
});



app.get('/allstudent', async (req, res) => {
  try {
    const data = await Student.find({}); // সব student আনবে
    console.log("All students:", data);
    res.send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching students");
  }
});



//app.get('/allstudent', async (req, res) => {
   // console.log(req.params.id)
 //let data = await Student.find({_id:req.params.id})
 // res.send(data)
//});


app.get('/student/:id',async (req, res) => {
console.log(req.params.id)
 let data = await Student.find({_id:req.params.id})
  res.send(data)
})


app.patch('/student/:id',async (req, res) => {
console.log(req.params.id)
 let data = await Student.findByIdAndUpdate({_id:req.params.id},
  {
      studentname:req.body.studentname,
      departmentname:req.body.departmentname,
      studentid:req.body.studentid,
      phonenumber:req.body.phonenumber,

 })
  res.send(data);
});



app.post('/delete',async (req, res) => {

 let data = await Student.findByIdAndDelete({_id: req.body.id})
  res.send("Deleted")
});




app.post("/leave",async(req, res) => {

let existingLeave = await Leave.findOne({ studentid: req.body.studentId});
 
if (existingLeave){
 //console.log("hello")
 // console.log(req.params.id)
 let data = await Leave.findOneAndUpdate(
  {studentid: req.body.studentId},
  {
      studentname: req.body. studentName,
      departmentname:req.body.departmentName,
      studentid:req.body.studentId,
      total:existingLeave.total+1
 }


);
    

}else{
   let leave = new Leave({
     studentname: req.body. studentName,
     departmentname:req.body.departmentName,
      studentid:req.body.studentId,
      total:1
  
   }).save();

}
 
  
   res.send("Leave Created");
});

app.get("/leave",async(req,res)=>{
  let data = await Leave.find({})
  res.send(data)
})


app.delete("/leave/:id", async (req, res) => {
  await Leave.findByIdAndDelete(req.params.id);
  res.send("Leave Deleted");
});


app.put("/leave/:id", async (req, res) => {
  try {
    const updatedData = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        studentname: req.body.studentName,
        departmentname: req.body.departmentName,
        studentid: req.body.studentId
      },
      { new: true }
    );

    res.send(updatedData);

  } catch (error) {
    console.log(error);
    res.status(500).send("Update failed");
  }
});



app.post("/result",async(req,res)=>{
  
 let result = new Result({
    studentid: req.body.studentid,
   departmentname: req.body.departmentname,
   result:req. body.result,
   cgpa:  gpaCalculation(req.body.result)

   
 }).save()
  res.send("Result Publish")
})

app.get("/result",async(req,res)=>{
  let data = await Result.find({}).populate("studentid")
  res.send(data)
})



// Base URL : https://sandbox.aamarpay.com
// Store ID : aamarpaytest
// Signature Key : dbb74894e82415a2f7ff0ec3a97e4183

app.get("/duepayment",async(req,res)=>{

  
   let month = new Date().getMonth()+1
   let year = new Date ().getFullYear()
   let amount = 0
   let paymentCount = await Payment.find({year:year})
   if(paymentCount.length != month){
     let dueAmount = ( month - paymentCount.length) * 100
     amount = dueAmount
     
   }

  let paymentExist = await Payment.findOne({month:month})
  if(paymentExist){
     if(paymentExist.amount != amount){
       res.send(amount - paymentExist.amount)

   }else{
    res.send(0)
   }

  }else{
    res.send(amount)
  }
  
})

app.post("/payment",async (req,res)=>{
   console.log(new Date().getFullYear())
   let month = new Date().getMonth()+1
   let date = new Date ().getDate()
   let year = new Date ().getFullYear()
   let amount = req.body.amount
   let trans = new Date().getTime()



   let paymentCount = await Payment.find({year:year})
   if(paymentCount.length != month){
     let dueAmount = ( month - paymentCount.length) * 100
     amount = dueAmount

   }
  
  console.log(amount)
  


   let paymentExist = await Payment.findOne({month:month})
   if(paymentExist){
    return res.send({message:"Payment is done for this month"})
   }


 const url = "https://sandbox.aamarpay.com/index.php";

  try {
    const formData = {
      store_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      cus_name: req.body.studentname,
      cus_email: "example@gmail.com",
      cus_phone: "01870******",
      amount: amount,
      currency: "BDT",
      tran_id: trans,
      desc: "test transaction",
      success_url: "http:www.merchantdomain.com/successpage.html",
      fail_url: "http://localhost/aapaymentsuccessmarpay/callback/failed.php",
      cancel_url: "http://localhost/aamarpay/callback/cancel.php",
      type: "json"
    };

    // IMPORTANT: aamarpay requires form-data, not JSON
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

   
   



  //  let paymentSave = new payment({
  //      date:date,
  //        month:month,
  //       year:year,
  //       amount:req.body.amount,
  //        studentname: req.body.studentname,
  //         trans:trans

  let paymentSave = new Payment({
    date: date,
    month: month,
    year: year,
    amount:amount,
    studentname: req.body.studentname,
    trans: trans
   }).save()
   
     res.send(response.data);
  
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Payment request failed",
      details: err.message
    });
  }})




function gpaCalculation(result){
  let total = 0
  result.map((item)=>{
    console.log(item.result)
    if(item.result >= 80){
      total += 4
    } else if(item.result >=75){
      total += 3.75
    }else if(item.result >=70){
      total += 3.50
    }else if(item.result >=60){
      total += 3.25
    }else if(item.result >=55){
      total += 3.00
    }else if(item.result <=50){
      total += 0
    }
  })

  let cgpa = total / result.length
  return cgpa.toFixed(2)
}


app.listen(5000);
