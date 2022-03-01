import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import config from './config/index.js'
import { connect } from './utils/db.js'

import userRouter from './resources/user/user.router.js'
import fixtureRouter from './resources/fixture/fixture.router.js'
import apiFixtureRouter from './resources/apiFixture/apiFixture.router.js'
import standingRouter from './resources/standing/standing.router.js'
import apiStandingRouter from './resources/apiStanding/apiStanding.router.js'

import { signup, signInWithGoogle } from './resources/user/user.controllers.js'
import decodeToken from './middleware/decodeToken.js'

export const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/register', signup)
app.get('/login', decodeToken, signInWithGoogle)

app.use('/user', userRouter)
app.use('/api-fixture', apiFixtureRouter)
app.use('/fixture', decodeToken, fixtureRouter)
app.use('/api-standing', apiStandingRouter)
app.use('/standing', decodeToken, standingRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}/`)
    })
  } catch (e) {
    console.error(e)
  }
}
