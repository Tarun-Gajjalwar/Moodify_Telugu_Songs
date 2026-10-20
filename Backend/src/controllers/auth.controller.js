const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model")
const redis = require("../config/cache")

function getCookieOptions(req) {
    const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isHttps,
        sameSite: isHttps ? "none" : "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    };
}

function getClearCookieOptions(req) {
    const isHttps = req.secure || req.headers["x-forwarded-proto"] === "https" || process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isHttps,
        sameSite: isHttps ? "none" : "lax"
    };
}

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const isAlreadyRegistered = await userModel.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (isAlreadyRegistered) {
            return res.status(400).json({
                message: "User with the same email or username already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: hash
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "3d"
            }
        );

        res.cookie("token", token, getCookieOptions(req));

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                message: "User with the same email or username already exists"
            });
        }
        return res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password, username, identifier } = req.body;
        const id = identifier || email || username;

        if (!id || !password) {
            return res.status(400).json({
                message: "Email or username and password are required"
            });
        }

        const user = await userModel.findOne({
            $or: [
                { email: id },
                { username: id }
            ]
        }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "3d"
            }
        );

        res.cookie("token", token, getCookieOptions(req));

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
}

async function getMe(req, res) {
    try {
        const user = await userModel.findById(req.user.id);

        res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
}

async function logoutUser(req, res) {
    try {
        const token = req.cookies.token;

        res.clearCookie("token", getClearCookieOptions(req));

        if (token) {
            await redis.set(token, Date.now().toString(), "EX", 60 * 60);
        }

        res.status(200).json({
            message: "logout successfully."
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || "Internal server error"
        });
    }
}


module.exports = { registerUser, loginUser, getMe, logoutUser };