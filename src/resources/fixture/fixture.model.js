import mongoose from 'mongoose'

const fixtureSchema = new mongoose.Schema(
  {
    fixtureID: Number,
    date: Date,
    day: String,
    time: String,
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
    modified: Boolean,
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    }
  },
  { timestamps: true }
)

fixtureSchema.index({ createdBy: 1, fixtureID: 1 }, { unique: true })

export const Fixture = mongoose.model('fixture', fixtureSchema)

// const itemSchema = new mongoose.Schema(
//     {
//       name: {
//         type: String,
//         required: true,
//         trim: true,
//         maxlength: 50
//       },
//       status: {
//         type: String,
//         required: true,
//         enum: ['active', 'complete', 'pastdue'],
//         default: 'active'
//       },
//       notes: String,
//       due: Date,
//       createdBy: {
//         type: mongoose.SchemaTypes.ObjectId,
//         ref: 'user',
//         required: true
//       },
//       list: {
//         type: mongoose.SchemaTypes.ObjectId,
//         ref: 'list',
//         required: true
//       }
//     },
//     { timestamps: true }
//   )
