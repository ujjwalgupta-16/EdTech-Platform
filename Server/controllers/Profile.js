const Profile = require("../models/Profile")
const User = require("../models/User")
require("dotenv").config()
const { uploadImageToCloudinary } = require("../utils/imageUploader")

exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body
        const id = req.user.id
        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }
        const userDetails = await User.findById(id)
        const profileId = userDetails.additionalDetails
        const profileDetails = await Profile.findById(profileId)

        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.about = about
        profileDetails.gender = gender
        profileDetails.contactNumber = contactNumber
        await profileDetails.save()
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in updating profile. Please try again."
        })
    }
}

exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id
        const userDetails = await User.findById(id)
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        await Profile.findByIdAndDelete(userDetails.additionalDetails)
        await User.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in deleting account. Please try again."
        })
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec()
        console.log(userDetails)
        res.status(200).json({
            success: true,
            message: "User Data fetched successfully",
            data: userDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(displayPicture, process.env.FOLDER_NAME, 1000, 1000)
        console.log(image)
        const updatedProfile = await User.findByIdAndUpdate(
            userId,
            { image: image.secure_url },
            { new: true }
        )
        res.status(200).send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id })

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price

            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }

            return courseDataWithStats
        })

        res.status(200).json({
            success: true,
            courses: courseData
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}