const Auth = require("../models/authModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { promisify } = require("util");


const signJWT = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_WEB_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.addUser = async (req, res) => {
    try {
        var { email, password, firstName, userType } = req.body;
        if (!email || !password) {
            res.status(200).json({
                success: false,
                message: "email / password is invalid",
                data: []
            })

        }
        else if (!firstName || !userType) {
            res.status(200).json({
                success: false,
                message: "name / account type is invalid",
                data: []
            })

        }
        else {
            var user = await Auth.findOne({ email: email });
            if (!user) {
                var data = await Auth.create({
                    ...req.body,
                    name: req.body.firstName + ' ' + req.body.lastName
                })
                res.status(200).json({
                    success: true,
                    message: "Success",
                    data,
                })
            }
            else {
                res.status(200).json({
                    success: false,
                    message: "User Already Exists.",
                    data: []
                })
            }
        }
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}

exports.signin = async (req, res) => {
    try {
        var { email, password } = req.body;
        if (!email || !password) {
            res.status(200).json({
                success: false,
                message: "email / pasword is required",
                data: []
            })
        }
        else {
            var user = await Auth.findOne({ email: email });
            if (!user) {
                res.status(200).json({
                    success: false,
                    message: "email / pasword is incorrect",
                    data: []
                })
            } else {
                var passwordVerified = await bcrypt.compare(password, user.password);
                if (!passwordVerified) {
                    res.status(200).json({
                        success: false,
                        message: "email / pasword is incorrect",
                        data: []
                    })
                } else {
                    var token = signJWT(user._id);
                    user = {
                        ...user._doc,
                        token: token
                    }
                    res.status(200).json({
                        success: true,
                        message: "success",
                        token,
                        data: user
                    })
                }
            }
        }
    } catch (error) {
        res.status(200).json({
            success: false,
            message: error.message,
            data: []
        })
    }
}

exports.protect = async (req, res, next) => {
    try {
        var token = null;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
        }
        if (!token) {
            return res.status(200).json({
                data: [],
                success: false,
                message: "SESSION EXPIRED !"
            })
        }
        var { id: userId, iat: tokenIssuedAt } = await promisify(jwt.verify)(token, process.env.JWT_WEB_SECRET);
        var user = await Auth.findById(userId);
        if (!user) {
            return res.status(200).json({
                message: "Invalid token",
                data: [],
                success: false
            })
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(200).json({
            data: [],
            message: error.message,
            success: false,

        })
    }
};