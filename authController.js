const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
var fs = require('fs');
const { LinkedInProfileScraper } = require('linkedin-profile-scraper');
const { range } = require('lodash');
var suq = require("suq");
const User = require("./userModel");
const AppError = require("./appError");
const catchAsync = require("./catchAsync");

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRESIN,
});

exports.signUp = async (req, res) => {
   try {
       const newUser = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password,
         passwordConfirm: req.body.passwordConfirm,
         linkedin: req.body.linkedin,
         github: req.body.github
       });
       const token = signToken(newUser._id);
       const cookieOptions = {
         expires: new Date(
           Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
         ),
         // secure: true,
         httpOnly: true,
       };
       if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
 
       res.cookie("jwt", token, cookieOptions);
       res.status(201).json({
         status: "success",
         token,
         data: {
           newUser,
         },
       });
   } catch (error) {
     console.log(error);
     res.status(404).json({
       status: "fail",
       message: error,
     });
   }
};

exports.login = async (req, res, next) => {
   const { email, password } = req.body;
 
   if (!email || !password) {
     return next(new AppError("Please provide correct email and password", 400));
   }
   const user = await User.findOne({ email: email }).select("+password");

   if (
     !user ||
     !(await user.verifyPassword(
       password,
       user.password
     ))
   ) {
     return next(new AppError("No user found", 400));
   }
 
   const token = signToken(user._id);
   const cookieOptions = {
     expires: new Date(
       Date.now() + process.env.JWT_COOKIE_EXPIRESIN * 24 * 60 * 60 * 1000
     ),
     // secure: true,
     httpOnly: true,
   };
   if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
 
     res.cookie("jwt", token, cookieOptions);
     res.status(200).json({
       status: "success",
       token,
       data: {
         user,
       },
     });
 };

 exports.logout = (req, res) => {
   res.cookie("jwt", "Logout", {
     expires: new Date(Date.now() + 1),
     // secure: true,
     httpOnly: true,
   });
 
  //  res.redirect("/login");
   res.status(200).json({ status: "success" });
 };

 exports.protect = catchAsync(async (req, res, next) => {
  //  console.log(req.headers.cookie);
   let token;
 
   if (
     req.headers.authorization &&
     req.headers.authorization.startsWith("Bearer")
   ) {
     token = req.headers.authorization.split(" ")[1];
   } else if (req.headers.cookie) {
     token = req.headers.cookie.split("jwt=")[1];
   }
  //  console.log(token);
 
   if (!token) {
     return next(new AppError("Not Logged In", 401));
   }
 
   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
   //console.log(decoded);
 
   const freshUser = await User.findById(decoded.id);
   if (!freshUser) {
     return next(new AppError("User For This Token Does Not Exist", 401));
   }
 
   req.user = freshUser;
   // res.locals.user = freshUser;
 
   next();
 });

 exports.isLoggedIn = async (req, res, next) => {
   if (req.headers.cookie) {
     try {
       const decoded = await promisify(jwt.verify)(
         req.headers.cookie.split("jwt=")[1],
         process.env.JWT_SECRET
       );
 
       if (!decoded) {
         res.locals.user = undefined;
         return next();
       }
 
       const freshUser = await User.findById(decoded.id);
 
       if (!freshUser) {
         // res.locals.user = null;
         return next();
       }
 
       res.locals.user = freshUser;
       req.logged = freshUser;
       return next();
     } catch (err) {
       return next();
     }
   } else {
     res.locals.user = undefined;
   }
 
   next();
 };

 exports.restrictTo = (...roles) => {
   return (req, res, next) => {
     if (!roles.includes(req.user.role)) {
       return next(new AppError("Permission Denied", 403));
     }
 
     next();
   };
 };

 exports.linkedInScraper = async (st) => {
   const scraper = new LinkedInProfileScraper({
     sessionCookieValue:
       'AQEDATM0sxUAvr7gAAABdjKHrSMAAAF2VpQxI04AD70NQ2MzQR9VYcfJSLdAeaxY0sJujXKsEeiI1kggvp7p3S7G6g6L7tRbINU8I18Ynn2r_ACBaDrRBdroEcx-MhyttcwweLZZ_R3H8qzoIjspz6k5',
     keepAlive: true,
   });

   await scraper.setup();
   for (var i in range(0, 3, 1)) {
     const al = await scraper.run(st);
   }
   const js = await scraper.run(st);
 
   var company = [];
   var position = [];
   for (var i in js.experiences) {
     stitle = js.experiences[i].title;
     scompany = js.experiences[i].company;
     company.push(scompany);
     position.push(stitle);
   }

   var schools = [];
   var degree = [];
   for (var i in js.education) {
     sName = js.education[i].schoolName;
     sDegree = js.education[i].degreeName;
     schools.push(sName);
     degree.push(sDegree);
   }
 
   var skill = [];
   for (var i in js.skills) {
     skiller = js.skills[i].skillName;
     skill.push(skiller);
   }

   var profile = {
     name: js.userProfile.fullName,
     title: js.userProfile.title,
     description: js.userProfile.description,
     company: company,
     position: position,
     schools: schools,
     degree: degree,
     skills: skill,
   };

   return profile;
 };

 exports.gitHubScraper = async (url) => {
   suq(url, function (err, det, body) {
     if (!err) {
       var extra = det.microdata[0].props.additionalName.length + 2;
       var proj_names = [];
       for (var i in det.microdata) {
         rname = det.microdata[i].props.name.slice(
           extra,
           det.microdata[i].props.name.length
         );
         if (i > 0) {
           proj_names.push(rname);
         }
       }
 
       var profile = { name: det.microdata[0].props.name, Projects: proj_names };
       fs.writeFileSync(
          `GitHub.json`,
          JSON.stringify(profile)
       );
     }
   });
 };

//  gitHubScraper(`https://github.com/Tewatia5355?tab=repositories`);