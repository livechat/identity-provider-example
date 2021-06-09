import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'

async function signout(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  const tokenCookie = cookie.serialize('token', '', {
    path: '/',
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
  })

  res.setHeader('Set-Cookie', tokenCookie)
  res.status(200).end()
}

export default signout
