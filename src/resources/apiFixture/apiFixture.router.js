import express from 'express'
import { findApiFixtures } from './apiFixture.controllers.js'

const router = express.Router()

// get /api-fixture
router.route('/').get(findApiFixtures)

export default router
