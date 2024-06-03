const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
require("dotenv").config()


exports.createSubSection = async (req, res) => {
    try {
        const { sectionId, title, timeDuration, description } = req.body
        const video = req.files.videoFile
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                sucess: false,
                message: "All fields are required"
            })
        }
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME)
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl: uploadDetails.secure_url
        })

        const updatedSection = await Section.findByIdAndUpdate(sectionId, { $push: { subSection: subSectionDetails._id } }, { new: true }).populate("subSection").exec()
        return res.status(200).json({
            success: true,
            message: "Sub-Section created successfuly",
            updatedSection
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot create sub-section. Please try again"
        })
    }
}

exports.updateSection = async (req, res) => {
    try {
        const { subSectionName, subSectionId } = req.body
        if (!subSectionName || !subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        const section = await SubSection.findByIdAndUpdate(subSectionId, { subSectionName }, { new: true })

        return res.status(200).json({
            success: true,
            message: "Sub-section updated successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Unable to update sub-section. Please try again."
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId } = req.params
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        await SubSection.findByIdAndDelete(subSectionId)
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