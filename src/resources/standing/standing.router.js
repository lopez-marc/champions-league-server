import express from 'express'
import { findStandings } from './standing.controllers.js'

const router = express.Router();

// get /standing
router.route('/')
    .get(findStandings)

export default router;