import express from 'express'
import { findApiFinalStage } from './apiFinalStage.controllers.js'

const router = express.Router()

// get /api-final-stage
router.route('/').get(findApiFinalStage)

export default router
