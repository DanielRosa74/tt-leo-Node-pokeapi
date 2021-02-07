import mongoose from 'mongoose'

const { Schema, model } = mongoose

const pokemonsSchema = new Schema({
  _id: {
    type: mongoose.ObjectId,
    auto: true,
  },
  types: {
    type: [
      {
        type: mongoose.ObjectId,
        ref: 'Types',
      },
    ],
    required: true,
  },
  moves: {
    type: [
      {
        type: mongoose.ObjectId,
        ref: 'Moves',
      },
    ],
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  pokedex: {
    type: Number,
    required: true,
    unique: true,
  },
  image: {
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

export const Pokemons = model('Pokemons', pokemonsSchema, 'pokemons')