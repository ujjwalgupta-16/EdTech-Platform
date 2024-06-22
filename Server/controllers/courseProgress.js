const { mongoose } = require("mongoose")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")


exports.updateCourseProgress = async (req, res) => {
    const { courseId, subsectionId } = req.body
    const userId = req.user.id

    try {
        // Check if the subsection is valid
        const subsection = await SubSection.findById(subsectionId)
        if (!subsection) {
            return res.status(404).json({ error: "Invalid subsection" })
        }

        // Find the course progress document for the user and course
        let courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        })

        if (!courseProgress) {
            return res.status(404).json({
                success: false,
                message: "Course Progress does not exist",
            })
        }
        else {
            if (courseProgress.completedVideos.includes(subsectionId)) {
                return res.status(400).json({ error: "Subsection already completed" })
            }

            courseProgress.completedVideos.push(subsectionId)
        }

        await courseProgress.save()

        return res.status(200).json({
            success: true,
            message: "Course progress updated"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            error: "Internal server error"
        })
    }
}

