import jwt from 'jsonwebtoken'

import { User } from './user.model.js'
import { Fixture } from '../fixture/fixture.model.js'
import { ApiFixture } from '../apiFixture/apiFixture.model.js'
import { Standing } from '../standing/standing.model.js'
import { ApiStanding } from '../apiStanding/apiStanding.model.js'

import config from '../../config/index.js'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: 'need email and password' })
  }

  try {
    const user = await User.create(req.body)

    const token = newToken(user)

    try {
      const apiFixtures = await ApiFixture.find({})
        .select('-_id')
        .lean()
        .exec()

      const userFixtures = apiFixtures.map(fixture => ({
        ...fixture,
        createdBy: user._id
      }))

      await Fixture.insertMany(userFixtures)

      const apiStandings = await ApiStanding.find({})
        .select('-_id')
        .lean()
        .exec()

      const userApiStandings = apiStandings.map(standing => ({
        ...standing,
        createdBy: user._id
      }))

      await Standing.insertMany(userApiStandings)

      console.log(userApiStandings)

      res.status(201).json({ token })
    } catch (e) {
      console.error(e)
      res.status(400).end()
    }
  } catch (e) {
    console.error(e)
    return res.status(500).end()
  }
}

// user controllers.js
// export const me = (req, res) => {
//   res.status(200).json({ data: req.user })
// }

// export const updateMe = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.user._id, req.body, {
//       new: true
//     })
//       .lean()
//       .exec()

//     res.status(200).json({ data: user })
//   } catch (e) {
//     console.error(e)
//     res.status(400).end()
//   }
// }

// export const signin = async (req, res) => {
//   console.log(req.body)
//   if (!req.body.email || !req.body.password) {
//     return res.status(400).send({ message: 'need email and password' })
//   }

//   const invalid = { message: 'Invalid email and passoword combination' }

//   try {
//     const user = await User.findOne({ email: req.body.email })
//       .select('email password')
//       .exec()

//     if (!user) {
//       return res.status(401).send(invalid)
//     }

//     const match = await user.checkPassword(req.body.password)

//     if (!match) {
//       return res.status(401).send(invalid)
//     }

//     const token = newToken(user)
//     return res.status(201).send({ token })
//   } catch (e) {
//     console.error(e)
//     res.status(500).end()
//   }
// }

export const signInWithGoogle = async (req, res) => {
  // console.log('signInWithGoogle')
  // console.log(req.user.uid)
  try {
    const findUser = await User.findOne({ uid: req.user.uid })

    if (!findUser) {
      const reqUser = {
        name: req.user.name,
        picture: req.user.picture,
        email: req.user.email,
        uid: req.user.uid
      }

      const user = await User.create(reqUser)
      try {
        const apiFixtures = await ApiFixture.find({})
          .select('-_id')
          .lean()
          .exec()

        const userFixtures = apiFixtures.map(fixture => ({
          ...fixture,
          createdBy: user._id
        }))

        await Fixture.insertMany(userFixtures)

        const apiStandings = await ApiStanding.find({})
          .select('-_id')
          .lean()
          .exec()

        const userApiStandings = apiStandings.map(standing => ({
          ...standing,
          createdBy: user._id
        }))

        await Standing.insertMany(userApiStandings)

        console.log(userApiStandings)

        return res.status(201).send({ message: 'User created' })
      } catch (e) {
        console.error(e)
        res.status(400).end()
      }
    }
    return res.status(201).send({ message: 'User logged in' })
  } catch (e) {
    console.error(e)
    return res.status(500).end()
  }
}

// export const protect = async (req, res, next) => {
//   const bearer = req.headers.authorization

//   if (!bearer || !bearer.startsWith('Bearer ')) {
//     return res.status(401).end()
//   }

//   const token = bearer.split('Bearer ')[1].trim()
//   let payload
//   try {
//     payload = await verifyToken(token)
//   } catch (e) {
//     return res.status(401).end()
//   }

//   const user = await User.findById(payload.id)
//     .select('-password')
//     .lean()
//     .exec()

//   if (!user) {
//     return res.status(401).end()
//   }

//   req.user = user
//   next()
// }
