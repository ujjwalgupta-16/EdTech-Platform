const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

exports.resetPasswordToken = async (req, res) => {

    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not a registered user"
            })
        }

        const token = crypto.randomUUID()
        const updatedDetails = await User.findOneAndUpdate({ email }, { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, { new: true })
        const url = `http://localhost:3000/update-password/${token}`

        await mailSender(email, "Reset Password", `Password Reset Link: ${url}`)

        return res.status(200).json({
            success: true,
            message: "Email sent successfully, please use the link to reset password"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending mail"
        })

    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Password and Confirm Password values are different"
            })
        }
        const user = await User.findOne({ token })
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Invalid token"
            })
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token expired, regenerate token"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await User.findOneAndUpdate({ token }, { password: hashedPassword }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending mail"
        })

    }
}
