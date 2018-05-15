'use strict'

import mongoose from 'mongoose'
import { registerEvents } from './doc.events'

const DocSchema = new mongoose.Schema({
  url: String,
  method: String,
  params: [{}],
  description: String,
  response: String,
  example: {}
})

registerEvents(DocSchema)
export default mongoose.model('Doc', DocSchema)
