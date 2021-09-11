const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const validator = require("validator");
const authController = require("./authController")
// const random = require("../../utils/utils");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
      trim: true,
      maxLength: [20, "Name Too Large"],
      minLength: [0, "Name Too Small"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    password: {
      type: String,
      required: [true, "Password is Required"],
      minLength: [8, "Password Too Small"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Comfirm Password is Required"],
      minLength: [8, "Password Too Small"],
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords Do Not Match",
      },
    },
    linkedin: {
      type: String,
      required: [true, "LinkedIn Profile Link is Required"],
      unique: true,
    },
    github: {
      type: String,
      required: [true, "GitHub Profile Link is Required"],
      unique: true,
    },
    shortDesc: {
      type: String,
    },
    longDesc: {
      type: String,
    },
    skills: {
      type: [String],
    },
    schools: {
      type: [String],
    },
    degree: {
      type: [String],
    },
    company: {
      type: [String],
    },
    position: {
      type: [String],
    },
    projects: {
      type: [String],
    },
    authentic: {
      type: Number
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

userSchema.pre("save", async function (next) {
  const temp = await authController.gitHubScraper(this.github);
  const result = await authController.linkedInScraper(this.linkedin);
  this.shortDesc = result.title;
  this.longDesc = result.description;
  this.skills = result.skills;
  this.schools = result.schools;
  this.degree = result.degree;
  this.company = result.company;
  this.position = result.position;

  // const gitResult = JSON.parse(fs.readFileSync('./GitHub.json', {encoding:'utf8', flag:'r'}));
  this.projects = temp;
  next();
});

userSchema.methods.verifyPassword = async function (
  LoginPassword,
  signUpPassword
) {
  return await bcrypt.compare(LoginPassword, signUpPassword);
};

const User = mongoose.model("user", userSchema);
module.exports = User;


