const { default: mongoose } = require("mongoose")
const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail")


exports.capturePayment = async (req, res) => {
    try {
        const { courseId } = req.user
        const userId = req.user.id
        if (!courseId) {
            return res.status(500).json({
                success: false,
                message: "Please provide valid course ID"
            })
        }

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(500).json({
                success: false,
                message: "Course not found"
            })
        }

        const uid = new mongoose.Types.ObjectId.createFromHexString(userId)
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(400).json({
                success: false,
                message: "Student is already enrolled"
            })
        }

        const amount = course.price
        const currency = "INR"
        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId,
                userId
            }
        }

        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)

        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.verifySignature = async (req, res) => {
    try {
        const webhookSecret = "123456789"
        const siganture = req.headers("x-razorpay-signature")
        const shasum = crypto.createHmac("sha256", webhookSecret)
        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest("hex")

        if (siganture === digest) {
            console.log("Payment is authorized")

            const { courseId, userId } = req.body.payload.payment.entity.notes
            const enrolledCourse = await Course.findByIdAndUpdate(courseId, { $push: { studentsEnrolled: userId } }, { new: true })
            if (!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found"
                })
            }
            console.log(enrolledCourse)

            const enrolledStudent = await User.findByIdAndUpdate(userId, { $push: { courses: courseId } }, { new: true })
            console.log(enrolledStudent)

            const emailResponse = await mailSender(enrolledStudent.email, `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`))

            return res.status(200).json({
                success: true,
                message: "Course bought successfully"
            })
        } else {
            return res.status(400).json({
                success: false,
                messasge: "Invalid request"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Error during payment. Plaese try again."
        })
    }
}