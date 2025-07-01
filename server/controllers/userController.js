import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

// User Signup
export const signup = async (req, res) => {
  const { fullname, email, password, bio } = req.body;

  try {
    if (!fullname || !email || !password || !bio) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(userData._id);

    res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check Authentication
export const isAuthenticated = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, bio, profilepic } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID missing",
      });
    }

    let profilepicUrl = "";

    if (profilepic && profilepic.startsWith("data:image")) {
      try {
        const uploadResult = await cloudinary.uploader.upload(profilepic, {
          folder: "user_profiles",
        });
        profilepicUrl = uploadResult.secure_url;
      } catch (cloudError) {
        console.error("Cloudinary Upload Error:", cloudError);
        return res.status(500).json({
          success: false,
          message: "Cloudinary upload failed",
        });
      }
    }

    const updateFields = { fullname, bio };
    if (profilepicUrl) {
      updateFields.profilepic = profilepicUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile Update Error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
