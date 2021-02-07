import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { Users } from '../models'

const usersRouter = Router()

usersRouter.get('/all', async (req, res) => {
    const users = await Users.find({})
    try {
        res.json({
            success: true,
            users,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

usersRouter.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const userDbType = await Users.findOne({_id: id})
        res.json({
            success: true,
            user: userDbType,
        })
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

usersRouter.post('/create', async (req, res) => {
    const { username, password } = req.body
    if(!username || !password){
        return res.status(400).json({
            success: false,
            message: 'Nome de usuário e senha são obrigatórios'
        })
    }

    const newUser = new Users({
        username,
        password
    })

    await newUser.save(err => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: err
            })
        }
        return res.status(201).json({
            success: true,
            user: newUser,
       })
    })
})


usersRouter.post('/update', async (req, res) => {
    const { _id, username, password } = req.body

    if(!username || !password){
        return res.status(400).json({
            success: false,
            message: "O nome de usuário e/ou a senha são obrigatórios"
        })
    }

    const user = await Users.findOne({ _id })
    
    user.username = username
    user.password = password
    user.updatedAt = new Date()
    
    await user.save(err => {
        if(err){
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: err
            })
        }
    })
    return res.status(200).json({
        success: true,
        user
    })

})

usersRouter.delete('/delete', async (req, res) => {
    const { _id } = req.body
    if (!_id) {
        return res.status(400).json({
            success: false,
            message: "_id é obrigatório"
        })
    }
    try {
        await Users.findOneAndDelete({ _id })
        return res.status(200).json({
            success: true,
            message: "Usuário excluído"
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Erro interno do servidor",
            error
        })
    }
})

usersRouter.post('/login', (req, res) => {
    const { username, password } = req.body
    Users.findOne({ username }, (err, user) => {
        if(!user) return res.status(400).json({
            success: false,
            message: 'Usuário não encontrado'
        })

        user.validatePassword(password, (err, isMatch) => {
            if(!isMatch) return res.status(400).json({
                success: false,
                message: err
            })
            const token = jwt.sign('payload', 'privateKey')
            return res.status(200).json({
                success: true,
                user,
                token
            })
        })
    })
})
export default usersRouter