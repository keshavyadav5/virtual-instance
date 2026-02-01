import uploadOncloudinary from "../config/cloudinary.js"
import geminiResponse from "../gemini.js"
import User from "../models/user.model.js"
import moment from 'moment'

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId
    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }
    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOncloudinary(req.file.path)
    } else if (imageUrl) {
      assistantImage = imageUrl
    } else {
      return res.status(400).json({
        message: "Please provide an image"
      })
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantImage: assistantImage,
        assistantName: assistantName
      },
      { new: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    return res.status(200).json(user)
  } catch (error) {
    console.error("Error updating assistant:", error)
    return res.status(500).json({
      message: "Internal server error",
    })
  }
}

export const askToAssistat = async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) {
      return res.status(400).json({
        message: "Command is required",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userName = user.name;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    if (!result) {
      return res.status(500).json({
        message: "Failed to receive a response from the AI assistant.",
      });
    }


    let cleanedResult = result.trim();

    if (cleanedResult.startsWith('```json')) {
      cleanedResult = cleanedResult.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedResult.startsWith('```')) {
      cleanedResult = cleanedResult.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const gemResult = JSON.parse(cleanedResult);

    const type = gemResult.type;
    switch (type) {
      case 'get-date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`
        });
      case 'get-time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`
        });
      case 'get-day':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("dddd")}`
        });
      case 'get-month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `today is ${moment().format("MMMM")}`
        });
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "google-search":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response
        });
      default:
        return res.status(400).json({ response: "I didn't understand the command." });
    }

  } catch (error) {
    console.error("Assistant Controller Error:", error);

    if (error.message.includes("Rate limit")) {
      return res.status(429).json({
        message: "Too many requests. Please wait a moment and try again.",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
