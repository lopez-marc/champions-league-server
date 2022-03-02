import { ApiFinalStage } from './apiFinalStage.model.js'

export const findApiFinalStage = async (req, res) => {
  try {
    const fixtures = await ApiFinalStage.find({})
      .select('-_id')
      .lean()
      .exec()
    res.status(200).json({ data: fixtures, message: 'api final stage' })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
