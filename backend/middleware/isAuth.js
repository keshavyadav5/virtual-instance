import jwt from 'jsonwebtoken'

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided"
      })
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

    req.userId = verifyToken.userId
    next()
  } catch (error) {
    console.log(error)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "Unauthorized - Invalid token"
      })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Unauthorized - Token expired"
      })
    }
    return res.status(500).json({
      message: "Internal server error"
    })
  }
}

export default isAuth