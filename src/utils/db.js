import mongoose from 'mongoose'
import config from '../config/index.js'

export const connect = (url = config.dbUrl, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true })
}
