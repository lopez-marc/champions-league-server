import mongoose from 'mongoose'

const standingSchema = new mongoose.Schema(
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
    modified: Boolean,
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    }
  },
  { timestamps: true }
)

standingSchema.index({ createdBy: 1, 'team.id': 1 }, { unique: true })

export const Standing = mongoose.model('standing', standingSchema)
