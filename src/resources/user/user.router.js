import express from 'express'

const router = express.Router()

const mockController = (req, res) => {
  res.json({ message: 'ok' })
}

// get /user
// post /user
router
  .route('/')
  .get(mockController)
  .post(mockController)

// get /user/:id
// put /user/:id
// delete /user/:id
router
  .route('/:id')
  .get(mockController)
  .put(mockController)
  .delete(mockController)

export default router
