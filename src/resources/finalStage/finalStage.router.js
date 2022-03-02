import express from 'express'
import { findFinalStage } from './finalStage.controllers.js'

const router = express.Router()

// get /final-stage
router.route('/').get(findFinalStage)

export default router
