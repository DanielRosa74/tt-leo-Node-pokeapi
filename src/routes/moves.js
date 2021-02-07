import { Router } from 'express'
import { Moves } from '../models'

const movesRouter = Router()

movesRouter.get('/all', async (req, res) => {
    const moves = await Moves.find({})
    try {
        res.json({
            success: true,
            moves,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

movesRouter.get('/:name', async (req, res) => {
    const { name } = req.params
    try {
        const moveDb = await Moves.findOne({name: name})
        res.json({
            success: true,
            move: moveDb,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

movesRouter.post('/create', async (req, res) => {
    const { name } = req.body
    if(!name){
        res.status(400).json({
            success: false,
            message: 'O nome é obrigatório'
        })
        return
    }

    const newMove = new Moves({
        name
    })

    await newMove.save(err => {
        if(err){
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: err
            })
        }
        res.status(201).json({
            success: true,
            move: newMove,
       })
    })
})


movesRouter.post('/update', async (req, res) => {
    const { name, id } = req.body

    if(!id){
        res.status(400).json({
            success: false,
            message: "O id é obrigatório"
        })
        return
    }

    const move = await Moves.findOne({ _id: id })
    
    move.name = name
    move.updatedAt = new Date()
    
    await move.save(err => {
        if(err){
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: err
            })
            return
        }
    })
    res.status(200).json({
        success: true,
        move
    })

})

movesRouter.delete('/delete', async (req, res) => {
    const { name } = req.body
    if (!name) {
        res.status(400).json({
            success: false,
            message: "O nome é obrigatório"
        })
        return
    }
    try {
        await Moves.findOneAndDelete({ name })
        res.status(200).json({
            success: true,
            message: "Movimento excluído"
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})
export default movesRouter