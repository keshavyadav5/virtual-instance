import express from 'express'
import { askToAssistat, getCurrentUser, updateAssistant } from '../controllers/user.controllers.js'
import isAuth from '../middleware/isAuth.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.get('/current', isAuth, getCurrentUser)
router.post('/update',isAuth,upload.single('assistantImage'), updateAssistant)
router.post('/asktoassistant', isAuth,askToAssistat)

export default router


