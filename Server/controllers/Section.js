const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        const newSection = await Section.create({ sectionName })
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
            {
                $push: {
                    courseContent: newSection._id
                }
            },
            { new: true }
        ).populate("courseContent").populate("subSection").exec()

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourse
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Unable to create section. Please try again."
        })
    }
}

exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body
        if (!sectionName || !sectionIdId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Section updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Unable to update section. Please try again."
        })
    }
}

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        await Section.findByIdAndDelete(sectionId)
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Unable to delete section. Please try again."
        })
    }
}