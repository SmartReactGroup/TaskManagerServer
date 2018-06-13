import mongoose, { Schema } from 'mongoose'
import { default_data } from '../config'

const MessageSchema = new Schema({
  content: {
    text: String
  },
  sender: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  target: {
    type: Schema.ObjectId,
    ref: 'Dialog'
  },
  date: {
    created: Date
  }
})

const DialogSchema = new Schema({
  name: String,
  description: String,
  announcement: String,
  background_image: String,
  initiator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  avatar: {
    type: String,
    default: default_data.chat_avatar
  },
  members: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  messages: [MessageSchema],
  type: {
    type: String,
    default: 'Single'
  },
  status: {
    type: String,
    default: 'Connected'
  }
})

export default mongoose.model('Dialog', DialogSchema)
