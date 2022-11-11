const Project = require("../models/projectsModel")
const multer = require("multer");
const { shapeProject, deleteFiles } = require("../utilities/projects");
const { v4: uuid } = require("uuid");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files')
    },
    filename: (req, file, cb) => {
        var split = file.originalname.split(".")
        var ext = split[split.length - 1];
        cb(null, `mozak-${req.user._id}-${uuid()}-${Date.now()}.${ext}`);
    }
});

exports.projectAttachment = multer({ storage: storage }).any();


exports.addProject = async (req, res) => {
    try {
        req.body.createdBy = req.user.email;
        if (req.files) {
            var data = shapeProject(req.body, req.files);
            data = await Project.create(data);
            res.status(200).json({
                success: true,
                message: "success",
                data
            })
        }
        else {
            var data = await Project.create(req.body);
            res.status(200).json({
                success: true,
                message: "success",
                data
            })
        }

    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
            data: []
        })
    }
};

exports.getAll = async (req, res) => {
    try {
        var data = await Project.find()
        res.status(200).json({
            success: true,
            message: "success",
            data
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}

exports.updateProject = async (req, res) => {
    try {
        if (req.files) {
            var { fileData } = await Project.findOne({ _id: req.body._id });
            deleteFiles(fileData)
            var data1 = shapeProject(req.body, req.files);
            var { _id, ...data2 } = JSON.parse(JSON.stringify(data1));
            var data = await Project.findOneAndUpdate({ _id: req.body._id }, data2, {
                new: true, //return new updated data
                runValidators: true //validate fields before updating
            })
            res.status(200).json({
                success: true,
                message: 'success',
                data
            })
        } else {
            var data = await Project.findOneAndUpdate({ _id: req.body.id }, req.body, {
                new: true, //return new updated data
                runValidators: true //validate fields before updating
            })
            res.status(200).json({
                success: true,
                message: success,
                data
            })
        }

    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}

exports.filterProjects = async (req, res) => {
    try {
        var data = await Project.find({ categoryType: req.query.category, subCategory: req.query.subCategory })
        res.status(200).json({
            success: true,
            message: `${data.length} record founds`,
            data
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}