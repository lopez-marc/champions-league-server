import express from 'express'
import { findFixtures, modifyFixture, resetFixture, findOneFixture } from './fixture.controllers.js';

const router = express.Router();

// get /fixture
//? post /fixture
router.route('/')
    .get(findFixtures)
    // .post(createOne)

// get /fixture/:id
// put /fixture/:id
router.route('/:id')
    .get(findOneFixture)
    .put(modifyFixture)

// put /fixture/reset/:id
router.route('/reset/:id')
    .put(resetFixture)

export default router;