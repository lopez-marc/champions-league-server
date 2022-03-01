import { Standing } from './standing.model.js'
import { User } from '../user/user.model.js'

export const findStandings = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })

    const standings = await Standing.find({ createdBy: user._id })
      // .select('-_id')
      .lean()
      .exec()

    res.status(200).json({ data: standings, msg: 'user standings' })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
