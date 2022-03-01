import mongoose from 'mongoose'

const apiStandingSchema = new mongoose.Schema(
  {
    rank: Number,
    team: {
      id: Number,
      name: String,
      country: String
    },
    points: Number,
    group: String,
    form: String,
    games: {
      played: Number,
      win: Number,
      draw: Number,
      lose: Number
    },
    goals: {
      for: Number,
      against: Number,
      difference: Number
    },
    update: Date,
    modified: Boolean
  },
  { timestamps: true }
)

export const ApiStanding = mongoose.model('apistanding', apiStandingSchema)
