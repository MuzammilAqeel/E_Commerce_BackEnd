const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const projectSchema = new mongoose.Schema({
    title: String,
    vendor: String,
    pdid: String,
    description: String,
    subCategory: String,
    fileFormat: String,
    fileData: Array,
    price: Number,
    createdBy: String,
    updatedBy: String
}, {
    timestamps: true
});


const Project = new mongoose.model("projects", projectSchema);

module.exports = Project;