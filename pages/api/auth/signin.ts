import bcrypt from 'bcrypt'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { openDB } from 'database/open'
import { User } from 'database/types'

type RequestBody = Partial<Pick<User, 'email' | 'password'>>

type ResponseBody = Omit<User, 'password'>

async function signin(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  try {
    const db = await openDB()
    res.once('finish', () => db.close())

    const { email, password } = req.body as RequestBody
    if (!email || !password) {
      res.status(400).end()
      return
    }

    const user = await db.get<User>('select * from Users where email = ?', [email])
    if (!user) {
      res.status(404).end()
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(400).end()
      return
    }

    const token = jwt.sign({ iss: user.id }, process.env.SECRET!, { expiresIn: '1h' })
    const tokenCookie = cookie.serialize('token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60,
      secure: process.env.NODE_ENV === 'production',
    })

    res.setHeader('Set-Cookie', tokenCookie)
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
    })
  } catch (error) {
    console.log(`\nError: POST /api/signin\n${error instanceof Error ? error.message : String(error)}\n`)
    res.status(500).end()
  }
}

export default signin
