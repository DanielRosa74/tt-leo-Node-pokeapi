import { Router } from 'express'

import usersRouter from './users'
import typesRouter from './types'
import movesRouter from './moves'
import pokemonsRouter from './pokemons'

const router = Router()

router.use('/users', usersRouter)
router.use('/types', typesRouter)
router.use('/moves', movesRouter)
router.use('/pokemons', pokemonsRouter)

export default router
