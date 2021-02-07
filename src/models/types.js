import mongoose from 'mongoose'

const { Schema, model } = mongoose

const typesSchema = new Schema({
  _id: {
    type: mongoose.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  hex: {
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

export const Types = model('Types', typesSchema, 'types')