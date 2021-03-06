import mongoose from 'mongoose'

const apiFixtureSchema = new mongoose.Schema(
  {
    fixtureID: Number,
    date: Date,
    status: String,
    round: String,
    group: String,
    teams: {
      home: {
        id: Number,
        name: String
      },
      away: {
        id: Number,
        name: String
      }
    },
    goals: {
      home: Number,
      away: Number
    },
    modified: Boolean
  },
  { timestamps: true }
)

export const ApiFixture = mongoose.model('apifixture', apiFixtureSchema)
