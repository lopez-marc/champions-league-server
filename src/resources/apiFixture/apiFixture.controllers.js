import { ApiFixture } from './apiFixture.model.js'

export const findApiFixtures = async (req, res) => {
  try {
    const fixtures = await ApiFixture.find({})
      .select('-_id')
      .lean()
      .exec()
    res.status(200).json({ data: fixtures, message: 'api fixtures' })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
