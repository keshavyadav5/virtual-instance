import React, { useContext, useRef, useState } from 'react'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.png'
import image3 from '../assets/image3.png'
import Card from '../components/Card'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";

const Customize = () => {
  const inputImage = useRef()
  const { selectedImage, setSelectedImage,
    uploadedImage, setUploadedImage } = useContext(userDataContext)
    const navigate = useNavigate()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result)
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='w-full min-h-screen bg-linear-to-b from-blue-800 to-black flex justify-center items-center flex-col px-4 py-8 sm:py-12 md:py-16 relative'>
      <h1 className='font-bold mb-4 sm:mb-6 md:mb-8 text-white text-base sm:text-lg md:text-xl lg:text-2xl text-center px-4'>
        Select your <span className='text-blue-500'>Assistant Image</span>
      </h1>
        <IoArrowBack className='absolute top-8 left-12 text-3xl text-white cursor-pointer' onClick={()=>navigate("/")} />
      <div className='w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl flex justify-center items-center flex-wrap gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-6 sm:mb-8 md:mb-10'>
        <Card
          image={image1}
          isSelected={selectedImage === image1}
          onClick={() => setSelectedImage(image1)}
        />
        <Card
          image={image2}
          isSelected={selectedImage === image2}
          onClick={() => setSelectedImage(image2)}
        />
        <Card
          image={image3}
          isSelected={selectedImage === image3}
          onClick={() => setSelectedImage(image3)}
        />

        {uploadedImage && (
          <Card
            image={uploadedImage}
            isSelected={selectedImage === uploadedImage}
            onClick={() => setSelectedImage(uploadedImage)}
          />
        )}

        <div
          onClick={() => inputImage.current.click()}
          className='w-28 h-32 sm:w-36 sm:h-40 md:w-40 md:h-48 lg:w-44 lg:h-52 bg-[#030326] border-2 border-blue-300 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-4 hover:border-white transition-all duration-300 flex items-center justify-center'
        >
          <svg className='w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white' fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <input
          type='file'
          accept='image/*'
          ref={inputImage}
          onChange={handleImageUpload}
          hidden
        />
      </div>

      {
        selectedImage && <button
          onClick={()=> navigate('/nextcustomize')}
          disabled={!selectedImage}
          className="min-w-37.5 sm:min-w-45 h-11 sm:h-12 px-6 sm:px-8 py-2 rounded-full bg-white hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold text-gray-800 cursor-pointer"
        >
          Next
        </button>
      }

    </div>
  )
}

export default Customize