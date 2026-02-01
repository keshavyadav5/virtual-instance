import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Signup from './pages/Signup'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import NextCustomize from './pages/NextCustomize'
import Home from './pages/Home'

import { userDataContext } from './context/UserContext'

const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(userDataContext)

  if (!userData) {
    return <Navigate to="/signin" replace />
  }

  return children
}

const HomeRoute = ({ children }) => {
  const { userData } = useContext(userDataContext)

  if (!userData) {
    return <Navigate to="/signin" replace />
  }

  if (!userData.assistantImage || !userData.assistantName) {
    return <Navigate to="/customize" replace />
  }

  return children
}

const AuthRoute = ({ children }) => {
  const { userData } = useContext(userDataContext)

  if (userData) {
    if (userData.assistantImage && userData.assistantName) {
      return <Navigate to="/" replace />
    }
    return <Navigate to="/customize" replace />
  }

  return children
}

const App = () => {
  return (
    <Routes>

      <Route
        path="/"
        element={
          <HomeRoute>
            <Home />
          </HomeRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        }
      />

      <Route
        path="/signin"
        element={
          <AuthRoute>
            <SignIn />
          </AuthRoute>
        }
      />

      <Route
        path="/customize"
        element={
          <ProtectedRoute>
            <Customize />
          </ProtectedRoute>
        }
      />

      <Route
        path="/nextcustomize"
        element={
          <ProtectedRoute>
            <NextCustomize />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App
