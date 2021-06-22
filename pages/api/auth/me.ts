import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

import { User } from 'database/types'
import { openDB } from 'database/open'

type ResponseBody = Omit<User, 'password'>

async function me(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const { token } = cookie.parse(req.headers.cookie ?? '')
    if (!token) {
      res.status(401).end()
    }

    const { iss } = jwt.verify(token, process.env.SECRET!) as Record<string, string>
    const db = await openDB()
    res.once('finish', () => db.close())

    const user = await db.get<User>('select * from Users where id = ?', [iss])
    if (!user) {
      res.status(401).end()
      return
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
    })
  } catch (error) {
    console.log(`\nError: POST /api/me\n${error.message}\n`)
    res.status(401).end()
  }
}

export default me
