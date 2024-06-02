const Course = require("../models/Course")
const Tag = require("../models/Tag")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()

exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body
        const thumbnail = req.files.thumbnailImage

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const userId = req.user.id
        const instructorDetails = await User.findById(userId)
        console.log("Instructor Details: ", instructorDetails)

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found"
            })
        }
        const tagDetails = await Tag.findById(tag)
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag details not found"
            })
        }
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url
        })

        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        )

        await Tag.findByIdAndUpdate(
            { _id: tagDetails._id },
            {
                $push: {
                    courses: newCourse._id
                }
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse
        })
    } catch (error) {

        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create a course. Please try again"
        })
    }
}

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({})

        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: allCourses
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot fetch data. Please try again."
        })
    }
}