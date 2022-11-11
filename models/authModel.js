const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authScheme = new mongoose.Schema({
    email:String,
    password:String,
    name:String,
    userType:String,
})

authScheme.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    var encryptedPassword = await bcrypt.hash(this.password, 12);
    this.password = encryptedPassword;
    this.passwordConfirm = undefined;
    next();
})


const Auth = new mongoose.model("auth" , authScheme);

module.exports = Auth;