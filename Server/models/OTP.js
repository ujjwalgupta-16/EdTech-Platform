const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

const sendVerificationEmail = async (email, otp) => {
    try {
        console.log("Email", email)
        console.log("OTP", otp)
        const mailResponse = await mailSender(email, "Verification Mail from StudyNotion", emailTemplate(otp))
        console.log("Email Sent Successfully", mailResponse.response)
    } catch (error) {
        console.log("Error occurred while sending mail", error)
    }
}

OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPSchema)