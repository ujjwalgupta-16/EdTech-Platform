const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    const emailRes = await mailSender(
      email,
      "Your data sent successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    )
    console.log("Email Response ", emailRes)
    return res.json({
      success: true,
      message: "Email sent successfully",
    })
  } catch (error) {
    console.log(error)
    return res.json({
      success: false,
      message: error.message
    })
  }
}