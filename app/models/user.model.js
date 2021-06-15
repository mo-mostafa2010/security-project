const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    expire_at: {type: Date, default: Date.now},
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    jobs: Array,
    users: Array,
    masterUser: String,
    profile: {
      name: String,
      surname: String,
      username: String,
      title: String,
      birthDate: String,
      disabilityDegree: Number,
      certeficateAvailable: Boolean,
      AMSRegisterd: Boolean,
      mobile:String,
      supportedVal: String,
      allowTo: String,
      deleteAfterSixMonth: Boolean,
      includeProfile: {type:Boolean, default:false},
      employmentLevel: Array,
      file: String,
      coverLetter: String,
      certeficates: String,
      supportedBy: String
    }
  })
);
module.exports = User;
