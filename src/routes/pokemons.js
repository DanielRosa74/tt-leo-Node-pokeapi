import { Router } from 'express'
import { Pokemons, Types, Moves } from '../models'

const pokemonsRouter = Router()

pokemonsRouter.get('/all', async (req, res) => {
    const pokemons = await Pokemons.find({}).populate('types').populate('moves')
    try {
        res.json({
            success: true,
            pokemons,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

pokemonsRouter.get('/:name', async (req, res) => {
    const { name } = req.params
    try {
        const pokemonDb = await Pokemons.findOne({name: name}).populate('types').populate('moves')
        res.json({
            success: true,
            pokemon: pokemonDb,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

pokemonsRouter.post('/create', async (req, res) => {
    const { types: requestTypes, moves: requestMoves } = req.body
    
    const promises = []

    requestTypes.forEach(type => {
        promises.push(Types.findOne({ name: type }))
    })

    requestMoves.forEach(move => {
        promises.push(Moves.findOne({ name: move }))
    })

    Promise.allSettled(promises).then(results => {
        const types = []
        const moves = []

        results.forEach(({ status, value }) => {
            if(status === 'fulfilled' && value) {
                types.push(value._id)
                moves.push(value._id)
            }
        })

        const newPokemon = new Pokemons( { ...req.body, types, moves })

        newPokemon.save(err => {
            if(err){
                return res.status(500).json({
                    success: false,
                    message: 'Erro interno do servidor',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                pokemon: newPokemon,
            })
        })
    })
})

pokemonsRouter.post('/update', async (req, res) => {
    const { name } = req.body

    if(!name){
        res.status(400).json({
            success: false,
            message: "O nome é obrigatório"
        })
        return
    }

    const pokemon = await Pokemons.findOne({ name })
    
    if(req.body.types) {
        const promises = []

        req.body.types.forEach(type => {
            promises.push(Types.findOne({ name: type }))
        })
        
        Promise.allSettled(promises).then(results => {
                results.forEach(({ status, value }) => {
                if(status === 'fulfilled' && value) {
                    pokemon.types.push(value._id)
                }
            })
        })
    }

    if(req.body.moves) {
        const promises = []

        req.body.moves.forEach(move => {
            promises.push(Moves.findOne({ name: move }))
        })
        
        Promise.allSettled(promises).then(results => {
            results.forEach(({ status, value }) => {
                if(status === 'fulfilled' && value) {
                    pokemon.moves.push(value._id)
                }
            })
        })
    }

    if(req.body.height) pokemon.height = req.body.height
    if(req.body.weight) pokemon.weight = req.body.weight
    if(req.body.image) pokemon.image = req.body.image
    pokemon.updatedAt = new Date()
    
    await pokemon.save(err => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: err
            })
        }
        res.status(200).json({
            success: true,
            pokemon
        })
    })
})

pokemonsRouter.delete('/delete', async (req, res) => {
    const { name } = req.body
    if (!name) {
        return res.status(400).json({
            success: false,
            message: "O nome é obrigatório"
        })
    }
    try {
        await Pokemons.findOneAndDelete({ name })
            return res.status(200).json({
            success: true,
            message: "Pokemon excluído"
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error   
        })
    }
})

export default pokemonsRouter