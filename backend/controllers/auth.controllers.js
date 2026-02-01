import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existEmail = await User.findOne({ email })
    if (existEmail) {
      return res.status(400).json({ message: "email already exist" })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    })

    const token = await genToken(user?._id)
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: null,
      secure: true
    })
    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({ message: `signup error ${error}` })
  }
}


export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "email not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" })
    }

    const token = await genToken(user?._id)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,      
      sameSite: null,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({ message: `signup error ${error}` })
  }
}

export const logout = async (req, res) => {
  try {
    await res.clearCookie("token")
    return res.status(200).json({ message: "logout successfully" })
  } catch (error) {
    return res.status(500).json({ message: "unable to logout" })
  }
}
