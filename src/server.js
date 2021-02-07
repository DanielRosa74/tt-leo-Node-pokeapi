import express from 'express'
import mongoose from 'mongoose'

import router from './routes'
import { authMiddleware } from './middlewares'

function initializeMongo() {
  mongoose
    .connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
    )
    .then(() => console.log('Conectado ao mongo'))
    .catch(err => console.log(err))
}

function startServer({ port = process.env.PORT } = {}) {
  const app = express()

  app.use(express.json())

  app.use(authMiddleware)

  app.use('/api', router)

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      console.log(`Rodando servidor na porta ${server.address().port}`)

      resolve(server)
    })
  })
}

export { startServer, initializeMongo }