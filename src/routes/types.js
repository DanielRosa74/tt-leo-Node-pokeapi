import { Router } from 'express'
import { Types } from '../models'

const typesRouter = Router()

typesRouter.get('/all', async (req, res) => {
    const types = await Types.find({})
    try {
        res.json({
            success: true,
            types,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

typesRouter.get('/:name', async (req, res) => {
    const { name } = req.params
    try {
        const typeDb = await Types.findOne({name: name})
        res.json({
            success: true,
            type: typeDb,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

typesRouter.post('/create', async (req, res) => {
    const { name, hex } = req.body
    if(!name || !hex){
        res.status(400).json({
            success: false,
            message: 'Nome e o hexadecimal são obrigatórios'
        })
        return
    }

    const newType = new Types({
        name,
        hex
    })

    await newType.save(err => {
        if(err){
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: err
            })
        }
        res.status(201).json({
            success: true,
            type: newType,
       })
    })
})


typesRouter.post('/update', async (req, res) => {
    const { name, hex } = req.body

    if(!name || !hex){
        res.status(400).json({
            success: false,
            message: "O nome e/ou o hexadecimal são obrigatórios"
        })
        return
    }

    const type = await Types.findOne({ name })
    
    type.name = name
    type.hex = hex
    type.updatedAt = new Date()
    
    await type.save(err => {
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
        type
    })

})

typesRouter.delete('/delete', async (req, res) => {
    const { name } = req.body
    if (!name) {
        res.status(400).json({
            success: false,
            message: "O nome é obrigatório"
        })
        return
    }
    try {
        await Types.findOneAndDelete({ name })
        res.status(200).json({
            success: true,
            message: "Tipo excluído"
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})
export default typesRouter