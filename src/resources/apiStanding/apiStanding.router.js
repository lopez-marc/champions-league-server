import express from 'express'
import { findApiStandings } from './apiStanding.controllers.js'

const router = express.Router()

// get /api-standing
router.route('/').get(findApiStandings)

export default router
