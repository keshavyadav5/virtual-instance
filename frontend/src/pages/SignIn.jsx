import { Link, useNavigate } from "react-router-dom"
import bg from "../assets/authPg.png"
import { useContext, useState } from "react"
import { userDataContext } from "../context/UserContext"
import axios from 'axios'

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { serverUrl, userData, setUserData } = useContext(userDataContext)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      setError("")
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email, password
      }, { withCredentials: true })
      setUserData(result.data)
      navigate('/')
    } catch (error) {
      console.log(error)
      setUserData(null)
      setError(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full h-screen bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form onSubmit={handleSignUp} className="w-[90%] h-125 max-w-120 rounded-2xl bg-[#00000069] backdrop-blur px-4 shadow-black flex flex-col items-center justify-center gap-5">
        <h1 className="text-white text-xl font-semibold mb-3">Login to <span className="text-blue-400">virtual Assistant</span></h1>

        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="email"
          className="w-full h-12 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-4 py-2 rounded-full text-xl"
        />

        <div className="w-full h-12 border-2 border-white bg-transparent text-white rounded-full">
          <input
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="password"
            className="w-full h-full outline-none bg-transparent text-white placeholder-gray-300 px-4 py-2 rounded-full text-xl"
          />
        </div>

        {error.length > 0 && <p className="text-red-500 text-sm">@{error}</p>}

        <button
          disabled={loading}
          className="min-w-37.5 h-12 px-6 py-2 rounded-full bg-white hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <Link to="/signup" className="text-white text-sm cursor-pointer">
          Don't have an account? <span className="text-blue-400 underline">Sign Up</span>
        </Link>
      </form>
    </div>
  )
}

export default SignIn
