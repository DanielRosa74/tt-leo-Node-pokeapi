import mongoose from 'mongoose'

const { Schema, model } = mongoose

const movesSchema = new Schema({
  _id: {
    type: mongoose.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
})

export const Moves = model('Moves', movesSchema, 'moves')