import { ApiStanding } from './apiStanding.model.js'

export const findApiStandings = async (req, res) => {
  try {
    const standings = await ApiStanding.find({})
      // .select('-_id')
      .lean()
      .exec()

    res.status(200).json({ data: standings, msg: 'api standings' })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
