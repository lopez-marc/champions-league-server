import { FinalStage } from './finalStage.model.js'

export const findFinalStage = async (req, res) => {
  try {
    const fixtures = await FinalStage.find({})
      .select('-_id')
      .lean()
      .exec()
    res.status(200).json({ data: fixtures, message: 'final stage' })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
