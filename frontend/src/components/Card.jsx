import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Card = ({ image }) => {
  const { selectedImage, setSelectedImage } = useContext(userDataContext)
  
  const isSelected = selectedImage === image

  return (
    <div 
      onClick={() => setSelectedImage(image)}
      className={`w-28 h-32 sm:w-36 sm:h-40 md:w-40 md:h-48 lg:w-44 lg:h-52 bg-[#030326] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-4 border-white shadow-2xl shadow-blue-900' 
          : 'border-2 border-blue-300 hover:border-4 hover:border-white hover:shadow-2xl hover:shadow-blue-900'
      }`}
    >
      <img src={image} alt="image" className='w-full h-full object-cover' />
    </div>
  )
}

export default Card
