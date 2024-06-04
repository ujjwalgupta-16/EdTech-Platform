const Profile = require("../models/Profile")
const User = require("../models/User")

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