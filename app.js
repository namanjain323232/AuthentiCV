const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authController = require("./authController");
const User = require("./userModel")
const Review = require("./reviewModel")

const app = express();
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));
app.use(express.static(path.join(__dirname, "public")));

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASEPASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected");
  });

app.get('/', authController.isLoggedIn, function(req,res){
   res.render('homePage');
   //__dirname : It will resolve to your project folder.
 });
 app.get('/s/:id', authController.isLoggedIn, authController.protect, async function(req,res){
  const s = await User.findById(req.params.id);
  const r = await Review.find({ sId: req.params.id })
  // console.log(s);
  res.render('studentPage', { s, r });
  //__dirname : It will resolve to your project folder.
});
app.get('/adminControl/:id', authController.isLoggedIn, authController.protect, async function(req,res){
  const a = await User.findById(req.params.id);
  const stu = await User.find({ role: 'student' });
  // console.log(stu);
  res.render('adminPage', { a, stu });
  //__dirname : It will resolve to your project folder.
});
 app.get('/signup',function(req,res){
   res.render('signupPage');
   //__dirname : It will resolve to your project folder.
 });
 app.get('/login',function(req,res){
   res.render('loginPage');
   //__dirname : It will resolve to your project folder.
 });
 app.get('/fileUpload', authController.isLoggedIn, function(req,res){
  var skills = req.logged.skills.join(' ');
  var education = req.logged.schools.join(' ') + ' ';
  var experience = req.logged.company.join(' ') + ' ';
  var degree = req.logged.degree.join(' ');
  var position = req.logged.position.join(' ');

  education = education.concat(degree);
  experience = experience.concat(position);

  // console.log(education);
  // console.log(experience);

  res.render('fileUploadPage', { skills, education, experience });
  //__dirname : It will resolve to your project folder.
});

app.get('/review/s/:id/adminControl/:glasses',function(req,res){
  res.render('reviewPage');
  //__dirname : It will resolve to your project folder.
});

app.post('/api/v1/signup', authController.signUp);
app.post('/api/v1/login', authController.login);
app.get('/api/v1/logout', authController.logout);
app.post('/api/v1/review', async function(req,res){
  const newReview = await Review.create({
    review: req.body.review,
    reviewId: req.body.reviewId,
    sId: req.body.sId
  });

  res.status(201).json({
    status: "success",
    data: {
      newReview,
    }
  });
  //__dirname : It will resolve to your project folder.
});

app.patch('/api/v1/checker', authController.isLoggedIn, async function(req,res){
  const currentUser = await User.findByIdAndUpdate(req.logged._id, {
    authentic: req.body.authentic
  });
  console.log(req.body.authentic);

  res.status(201).json({
    status: "success",
    data: {
      currentUser,
    }
  });
  //__dirname : It will resolve to your project folder.
});

const port = process.env.PORT;
app.listen(port || 3000, () => {
  console.log("Listening");
});
