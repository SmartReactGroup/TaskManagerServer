'use strict'

import mongoose from 'mongoose'
import { registerEvents } from './doc.events'

const TaskSchema = new mongoose.Schema({
  title: String,
  issue_link: String,
  project_link: String,
  apis: [{
    name: String,
    url: String,
    method: String,
    params: [{}],
    description: String,
    response: String,
    example: {}
  }]
})

registerEvents(TaskSchema)
export default mongoose.model('Task', TaskSchema)
