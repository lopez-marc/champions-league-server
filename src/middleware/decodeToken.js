import admin from '../config/firebase.js'

const decodeToken = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1]
  try {
    const decode = await admin.auth().verifyIdToken(token)
    if (decode) {
      req.user = decode
      return next()
    }

    return res.json({ message: 'Unauthorized' })
  } catch (error) {
    console.error(error)
    return res.json({ message: 'Internal error' })
  }
}

export default decodeToken
