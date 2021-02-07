import { Users } from '../models'

import jwt from 'jsonwebtoken'

async function authMiddleware(req, res, next) {
  try{
    const token = req.headers?.authorization?.split(' ')[1] || 'sem-token'
    const decodedToken = jwt.verify(token, 'privateKey')
    console.log(
      decodedToken
    )
    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: 'Erro interno do servidor'
    })
  }

//  next()
}

export { authMiddleware }