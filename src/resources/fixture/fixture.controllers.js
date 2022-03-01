import { Fixture } from './fixture.model.js'
import { ApiFixture } from '../apiFixture/apiFixture.model.js'
import { Standing } from '../standing/standing.model.js'
import { User } from '../user/user.model.js'

export const findFixtures = async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid })

    const fixtures = await Fixture.find({ createdBy: user._id })
      .select('-_id')
      .lean()
      .exec()
    res.status(200).json({ data: fixtures, message: 'user fixtures' })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}
export const findOneFixture = async (req, res) => {
  try {
    const fixture = await Fixture.find({
      createdBy: req.user._id,
      fixtureID: req.params.id
    })
      // .select('-_id')
      .lean()
      .exec()

    res.status(200).json({ data: fixture, msg: 'ok' })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

const updateGoals = async (
  userID,
  team,
  playingIn,
  fixture,
  fixtureBeforeUpdate
) => {
  try {
    let goalsFor, goalsAgainst
    if (playingIn == 'home') {
      goalsFor = 'home'
      goalsAgainst = 'away'
    } else if (playingIn == 'away') {
      goalsFor = 'away'
      goalsAgainst = 'home'
    }

    const newGoalsFor =
      team.goals.for -
      fixtureBeforeUpdate.goals[goalsFor] +
      fixture.goals[goalsFor]
    const newGoalsAgainst =
      team.goals.against -
      fixtureBeforeUpdate.goals[goalsAgainst] +
      fixture.goals[goalsAgainst]
    const newDifference = newGoalsFor - newGoalsAgainst

    const updatedStanding = {
      goals: {
        for: newGoalsFor,
        against: newGoalsAgainst,
        difference: newDifference
      }
    }

    await Standing.findOneAndUpdate(
      { createdBy: userID, 'team.id': team.team.id },
      updatedStanding,
      {
        new: true
      }
    )
      .lean()
      .exec()
  } catch (e) {
    console.error(e)
  }
}
const whoWon = fixture => {
  if (fixture.goals.home > fixture.goals.away) {
    const result = [{ win: 1 }, { lose: 1 }]
    return result
  } else if (fixture.goals.home < fixture.goals.away) {
    const result = [{ lose: 1 }, { win: 1 }]
    return result
  } else if (fixture.goals.home == fixture.goals.away) {
    const result = [{ draw: 1 }, { draw: 1 }]
    return result
  }
}

const updateGames = async (
  userID,
  team,
  playingIn,
  fixture,
  fixtureBeforeUpdate
) => {
  try {
    const [homeResultBeforeUpdate, awayResultBeforeUpdate] = whoWon(
      fixtureBeforeUpdate
    )
    const [homeResult, awayResult] = whoWon(fixture)

    const teamGames = { ...team.games }

    let beforeResult
    let result
    if (playingIn === 'home') {
      beforeResult = homeResultBeforeUpdate
      result = homeResult
    } else if (playingIn === 'away') {
      beforeResult = awayResultBeforeUpdate
      result = awayResult
    }

    Object.entries(beforeResult).forEach(([resultKey, resultValue]) => {
      Object.entries(teamGames).forEach(([key, value]) => {
        if (key == resultKey) {
          teamGames[key] = value - resultValue
        }
      })
    })

    Object.entries(result).forEach(([resultKey, resultValue]) => {
      Object.entries(teamGames).forEach(([key, value]) => {
        if (key == resultKey) {
          teamGames[key] = value + resultValue
        }
      })
    })

    const updatedPoints = teamGames.win * 3 + teamGames.draw

    const updatedStanding = {
      games: teamGames,
      points: updatedPoints
    }

    await Standing.findOneAndUpdate(
      { createdBy: userID, 'team.id': team.team.id },
      updatedStanding,
      {
        new: true
      }
    )
      .lean()
      .exec()
  } catch (e) {
    console.error(e)
  }
}

const updateRanking = async (userID, fixture) => {
  const groupLetter = await Standing.findOne({
    createdBy: userID,
    'team.id': fixture.teams.home.id
  }).select('group createdBy -_id')

  const groupStandings = await Standing.find(groupLetter)

  groupStandings.sort((a, b) => b.points - a.points)
  // TODO: Tiebreakers
  groupStandings.forEach(async (item, index) => {
    const updatedRank = { rank: index + 1 }
    await Standing.findOneAndUpdate(
      { createdBy: userID, 'team.id': item.team.id },
      updatedRank,
      {
        new: true
      }
    )
      .lean()
      .exec()
  })
}

const updateStanding = async (userID, fixture, fixtureBeforeUpdate) => {
  // console.log('update standing')
  // console.log(userID)
  try {
    const standingHomeTeam = await Standing.findOne({
      createdBy: userID,
      'team.id': fixture.teams.home.id
    })

    const standingAwayTeam = await Standing.findOne({
      createdBy: userID,
      'team.id': fixture.teams.away.id
    })

    updateGoals(userID, standingHomeTeam, 'home', fixture, fixtureBeforeUpdate) //? req?

    updateGoals(userID, standingAwayTeam, 'away', fixture, fixtureBeforeUpdate)

    updateGames(userID, standingHomeTeam, 'home', fixture, fixtureBeforeUpdate)

    updateGames(userID, standingAwayTeam, 'away', fixture, fixtureBeforeUpdate)

    updateRanking(userID, fixture) //? req?
  } catch (e) {
    console.error(e)
  }
}

export const modifyFixture = async (req, res) => {
  // console.log('modifiy Fixture')
  // console.log(req.body.data)
  // console.log(req.user)
  // console.log(req.params.id)
  try {
    const user = await User.findOne({ uid: req.user.uid })
    const userID = user._id.toString()
    const fixtureBeforeUpdate = await Fixture.findOne({
      createdBy: userID,
      fixtureID: req.params.id
    })
    // console.log(fixtureBeforeUpdate)

    const updatedMatch = {
      goals: {
        home: req.body.data.goals.home,
        away: req.body.data.goals.away
      },
      modified: true
    }
    const fixture = await Fixture.findOneAndUpdate(
      { createdBy: userID, fixtureID: req.params.id },
      updatedMatch,
      {
        new: true
      }
    )
      // .select('-_id')
      .lean()
      .exec()

    updateStanding(userID, fixture, fixtureBeforeUpdate) //TODO rework

    res.status(200).json({ data: fixture })
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

export const resetFixture = async (req, res) => {
  try {
    // TODO reset standings like in hte modify
    // const fixtureBeforeReset = await Fixture.findOne({createdBy:req.user._id,fixtureID:req.params.id})

    const apiFixture = await ApiFixture.find({ fixtureID: req.params.id })

    console.log(apiFixture)

    const updatedMatch = {
      goals: {
        home: apiFixture[0].goals.home,
        away: apiFixture[0].goals.away
      },
      modified: false
    }

    const fixture = await Fixture.findOneAndUpdate(
      { createdBy: req.user._id, fixtureID: req.params.id },
      updatedMatch,
      {
        new: true
      }
    )
      // .select('-_id')
      .lean()
      .exec()

    res.status(200).json(fixture)
  } catch (e) {
    console.error(e)
    res.status(400).end()
  }
}

// export const createOne = async (req, res) => {
//     const createdBy = req.user._id
// try {
//     const doc = await Fixture.create({ ...req.body, createdBy })
//     res.status(201).json({ data: doc })
// } catch (e) {
//     console.error(e)
//     res.status(400).end()
// }
// }
