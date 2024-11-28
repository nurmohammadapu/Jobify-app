import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { OTP } from "../models/OTP.js";
import otpGenerator from "otp-generator"
import { userCreationConfirmation } from "../mail/templates/instructorApprovalConfirmation.js";
import mailSender from "../utils/mailSender.js";


// Send OTP For Email Verification
export const sendotp = async (req, res) => {
    try {
      const { email } = req.body
  
      const checkUserPresent = await User.findOne({ email })

      if (checkUserPresent) {
        // Return 401 Unauthorized status code with error message
        return res.status(401).json({
          success: false,
          message: `User is Already Registered`,
        })
      }
  
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
      const result = await OTP.findOne({ otp: otp })
      console.log("Result is Generate OTP Func")
      console.log("OTP", otp)
      console.log("Result", result)
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        })
      }
      const otpPayload = { email, otp }
      const otpBody = await OTP.create(otpPayload)
      console.log("OTP Body", otpBody)
      res.status(200).json({
        success: true,
        message: `OTP Sent Successfully`,
        otp,
      })
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({ success: false, error: error.message })
    }
}

export const register = async (req, res) => {
    try {
        const { 
            fullname,
            email, 
            phoneNumber, 
            password, 
            confirmPassword, 
            role, 
            otp 
        } = req.body;

        // Check if all required fields are provided
        if (!fullname || !email || !phoneNumber || !password || !confirmPassword || !role || !otp) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
                success: false
            });
        }

        // Check if the email already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Verify OTP
        const otpRecord = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (otpRecord.length === 0 || otp !== otpRecord[0].otp) {
            return res.status(400).json({
                message: "Invalid or expired OTP.",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine approval status based on role
        const approved = role === 'recruiter' ? false : true;

        // Create the user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            approved, // Use dynamic approval
            profile: {
                profilePhoto: `https://api.dicebear.com/5.x/initials/svg?seed=${fullname}`,
            }
        });

        // Send user creation confirmation email
        const emailBody = userCreationConfirmation(fullname, role);
        await mailSender(email, "Account Created Successfully", emailBody);

        // Response message
        const message = role === 'recruiter'
            ? "Account created successfully. Please wait for approval from a super admin."
            : "Account created successfully.";

        return res.status(201).json({
            message,
            success: true
        });
    } catch (error) {
        console.log("Registration Error:", error);  // Log error
        res.status(500).json({
            message: "An error occurred during registration.",
            success: false
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
                success: false,
            });
        }

        // Find the user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if passwords match
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if the user is a recruiter and account is not approved
        if (user.role === "recruiter" && !user.approved) {
            return res.status(403).json({
                message: "Your account is pending approval by a super admin. Please wait for approval.",
                success: false,
            });
        }

        // Generate token
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

        // Prepare user data for response
        const responseData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        // Set token in cookie
        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Ensures cookie is sent only over HTTPS in production
            sameSite: "strict", // Restricts cookie to same-origin requests
        });

        // Send token and user data in response
        return res.status(200).json({
            message: `Welcome back, ${responseData.fullname}!`,
            user: responseData,
            token: token,  // Send the token in the response body
            success: true,
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({
            message: "An error occurred during login. Please try again later.",
            success: false,
        });
    }
};



export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}


export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        // If the required fields are not provided, return a bad request error
        if (!fullname && !email && !phoneNumber && !bio && !skills && !file) {
            return res.status(400).json({
                message: "No data provided for update.",
                success: false
            });
        }

        // If a file is uploaded, handle Cloudinary upload
        let fileUri;
        let cloudResponse;
        if (file) {
            fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            if (!cloudResponse || !cloudResponse.secure_url) {
                return res.status(500).json({
                    message: "Error uploading the file to Cloudinary.",
                    success: false
                });
            }
        }

        // Parse skills if provided
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        // Extract user ID from authenticated request (from middleware)
        const userId = req.id;
        let user = await User.findById(userId);

        // If user not found, return a 404 error
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Update user details
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // If a file was uploaded, update resume information
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        // Save the updated user object to the database
        await user.save();

        // Format the updated user data for response
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        // Log the error for debugging
        console.error("Error updating profile: ", error);

        // Return a generic error message, ensuring not to expose sensitive details
        return res.status(500).json({
            message: "An error occurred while updating the profile. Please try again later.",
            success: false
        });
    }
};

