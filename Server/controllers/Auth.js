const User = require("../models/User")
const Profile = require("../models/Profile")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const mailSender = require("../utils/mailSender")
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
require("dotenv").config()

exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body
        const chechkUserPresesnt = await User.findOne({ email })

        if (chechkUserPresesnt) {
            return res.status(401).json({
                success: false,
                message: "User Already Exists"
            })
        }

        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        })

        console.log("OTP generated: ", otp)
        let result = await OTP.findOne({ otp })
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            })
            result = await OTP.findOne({ otp })
        }

        const otpPayload = { email, otp }
        const otpBody = await OTP.create(otpPayload)
        console.log(otpBody)

        res.status(200).json({
            success: true,
            message: "OTP Sent Successfully",
            otp: otp
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, accountType, otp } = req.body
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password values do not match"
            })
        }
        const chechkUserPresesnt = await User.findOne({ email })

        if (chechkUserPresesnt) {
            return res.status(401).json({
                success: false,
                message: "User Already Exists"
            })
        }

        const recentOTP = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
        console.log(recentOTP)
        if (recentOTP.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }
        else if (otp !== recentOTP[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
                recentOTP
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        const user = await User.create({
            firstName, lastName, email, password: hashedPassword, accountType: accountType, approved: approved, additionalDetails: profileDetails._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName[0]}${lastName[0]}`
        })

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            user
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again"
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email }).populate("additionalDetails").lean()
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User doesn't exist"
            })
        }
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })
            user.token = token,
                user.password = undefined

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In Successfully"
            })
        }
        else {
            return res.status(41).json({
                success: false,
                message: "Incorrect Password"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(50).json({
            success: false,
            message: "Login failure, please try again"
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const userDetails = await User.findById(req.user.id)

        const { oldPassword, newPassword } = req.body

        const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "The password is incorrect"
            })
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            { password: encryptedPassword },
            { new: true }
        )

        try {
            const emailResponse = await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(updatedUserDetails.email, `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
                )
            )
            console.log("Email sent successfully:", emailResponse.response)
        } catch (error) {
            console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })
        }

        return res.status(200).json({ success: true, message: "Password updated successfully" })
    } catch (error) {
        console.error("Error occurred while updating password:", error)
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating password",
            error: error.message,
        })
    }
}
