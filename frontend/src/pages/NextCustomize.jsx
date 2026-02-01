import React, { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { IoArrowBack } from "react-icons/io5";

const NextCustomize = () => {
  const { userData, selectedImage, uploadedImage, serverUrl, setUserData } = useContext(userDataContext)
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setAssistantName(userData?.assistantName || "")
  }, [userData])

  const handleUpdateAssistant = async () => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("assistantName", assistantName)

      if (uploadedImage && selectedImage === uploadedImage) {
        const response = await fetch(uploadedImage)
        const blob = await response.blob()
        const file = new File([blob], "assistant-image.jpg", { type: "image/jpeg" })
        formData.append("assistantImage", file)
      } else {
        formData.append("imageUrl", selectedImage)
      }

      const res = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )

      if (res.status === 200) {
        setUserData(res.data)
      }
      navigate("/")
    } catch (error) {
      console.error("Error updating assistant:", error)
      alert(error.response?.data?.message || "Failed to update assistant")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-linear-to-b from-blue-800 to-black flex justify-center items-center flex-col px-4 py-8 sm:py-12 md:py-16 relative'>
      <h1 className='font-bold mb-4 sm:mb-6 md:mb-8 text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center px-4'>
        Enter your <span className='text-blue-500'>Assistant Name</span>
      </h1>
      <IoArrowBack className='absolute top-8 left-12 text-3xl text-white cursor-pointer' onClick={()=>navigate("/customize")} />

      <input
        type="text"
        required
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
        placeholder="eg: rahul"
        className="w-full max-w-md h-12 outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-4 py-2 rounded-full text-xl"
      />
      {
        assistantName && (
          <button
            onClick={handleUpdateAssistant}
            disabled={loading}
            className="min-w-32 h-11 mt-4 px-6 sm:px-8 py-2 rounded-full bg-white hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold text-gray-800 cursor-pointer"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        )
      }
    </div>
  )
}

export default NextCustomize