import { useContext, useEffect, useState } from "react"
import { userDataContext } from '../context/userContext'
import { useNavigate } from "react-router-dom"
import axios from "axios"

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [output, setOutput] = useState(null)
  const [error, setError] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [inputCommand, setInputCommand] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [recognition, setRecognition] = useState(null)

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true
      })
      console.log(result.status)
      if (result.status === 200) {
        setUserData(null)
        navigate("/signin")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCommand = (data) => {
    console.log("handled data", data)
    if (!data) {
      setError("Failed to get response. Please try again.")
      return
    }

    const { type, userInput, response } = data;
    setOutput(response)
    setError(null)

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "youtube-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
    }

    if (type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
    }

    if (type === "calculator-open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }

    if (type === "instagram-open") {
      window.open("https://www.instagram.com", "_blank");
    }

    if (type === "facebook-open") {
      window.open("https://www.facebook.com", "_blank");
    }

    if (type === "weather-show") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=weather+${query}`, "_blank");
    }
  }

  const processCommand = async (command) => {
    if (!command.trim()) return

    setIsProcessing(true)
    setError(null)

    try {
      const data = await getGeminiResponse(command)
      handleCommand(data)
    } catch (err) {
      console.error("Command processing time error:", err)
      setError("Something went wrong. Please try again.")
      setOutput(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputSubmit = async (e) => {
    e.preventDefault()
    if (!inputCommand.trim()) return

    await processCommand(inputCommand)
    setInputCommand("")
  }

  const toggleVoiceRecognition = () => {
    if (isListening) {
      recognition?.stop()
      setIsListening(false)
    } else {
      recognition?.start()
      setIsListening(true)
    }
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported")
      setError("Speech Recognition is not supported in your browser.")
      return
    }

    const recognitionInstance = new SpeechRecognition()
    recognitionInstance.continuous = false
    recognitionInstance.lang = "en-US"

    recognitionInstance.onresult = async (e) => {
      const transcript =
        e.results[e.results.length - 1][0].transcript.trim()
      console.log("transcript", transcript)
      setIsListening(false)

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        await processCommand(transcript)
      } else {
        setError(`Please say "${userData.assistantName}" to activate the assistant.`)
      }
    }

    recognitionInstance.onerror = (e) => {
      setIsListening(false)
      if (e.error === 'no-speech') {
        setError("No speech detected. Please try again.")
      } else if (e.error === 'not-allowed') {
        setError("Microphone access denied. Please enable it in browser settings.")
      } else {
        setError(`Speech recognition error: ${e.error}`)
      }
    }

    recognitionInstance.onend = () => {
      setIsListening(false)
    }

    setRecognition(recognitionInstance)

    return () => {
      recognitionInstance?.stop()
    }
  }, [userData?.assistantName])

  return (
    <div className='w-full min-h-screen bg-linear-to-b from-blue-800 to-black flex justify-center items-center flex-col px-4 py-8 sm:py-12 md:py-16 relative gap-3'>
      <div className="absolute top-12 right-10 flex flex-col gap-3">
        <button onClick={handleLogout} className="min-w-32 h-11 px-6 sm:px-8 py-2 rounded-full bg-white hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold text-gray-800 cursor-pointer" >
          Logout
        </button>
        <button onClick={() => navigate('/customize')} className="min-w-32 h-11 px-6 sm:px-8 py-2 rounded-full bg-white hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold text-gray-800 cursor-pointer">
          Customize
        </button>
      </div>

      <div className="max-w-2xl w-64 h-60 sm:w-75 sm:h-70 rounded-2xl flex justify-center items-center overflow-hidden">
        <img src={userData?.assistantImage} alt="" className="h-full object-cover" />
      </div>

      <h1 className="text-white font-bold text-2xl">I'm {userData?.assistantName}</h1>

      <div className="max-w-xl w-full mx-auto mt-6">
        <div className="bg-linear-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 shadow-lg shadow-black/40 transition-all duration-300">
          <p className="text-zinc-100 text-base leading-relaxed font-medium">
            {isProcessing ? "Processing..." : output || "How can I help you? Just command me."}
          </p>
        </div>
      </div>

      {error && (
        <div className="max-w-xl w-full mx-auto mt-2">
          <div className="bg-red-900/50 border border-red-700 rounded-xl px-4 py-3">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-xl w-full mx-auto mt-6">
        <form onSubmit={handleInputSubmit} className="flex gap-3">
          <input type="text" value={inputCommand} onChange={(e) => {
            setInputCommand(e.target.value);
            setError(null);
          }}
            placeholder={`Type your command for ${userData?.assistantName}...`}
            disabled={isProcessing} className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
          <button type="submit" disabled={isProcessing || !inputCommand.trim()} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed" >
            Send
          </button>
        </form>
      </div>

      <button onClick={toggleVoiceRecognition} disabled={isProcessing} className={`mt-4 w-16 h-16 rounded-full flex items-center justify-center transition-all        shadow-lg ${isListening
        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
        : 'bg-blue-600 hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isListening ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      <p className="text-zinc-400 text-sm mt-2">
        {isListening ? 'Listening... Click to stop' : 'Click to speak'}
      </p>
    </div>
  )
}

export default Home