import mongoose from 'mongoose'

const finalStageSchema = new mongoose.Schema(
  {
    fixtureID: Number,
    date: Date,
    status: String,
    round: String,
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

export const FinalStage = mongoose.model('finalstage', finalStageSchema)
