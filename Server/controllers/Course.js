const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()

exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, category } = req.body
        const thumbnail = req.files.thumbnailImage

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail) {
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
        const categoryDetails = await Category.findById(category)
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category details not found"
            })
        }
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
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

        await Category.findByIdAndUpdate(
            { _id: categoryDetails._id },
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