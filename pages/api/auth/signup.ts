import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import fetch from 'isomorphic-fetch'
import { NextApiRequest, NextApiResponse } from 'next'

import { openDB } from 'database/open'
import { LiveChatCustomer, User } from 'database/types'
import { getCustomerToken } from 'lib/get-customer-token'

type RequestBody = Partial<Omit<User, 'id'>>

type ResponseBody = Omit<User, 'password'>

async function signup(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }

  try {
    const { email, name, lastname, password } = req.body as RequestBody
    if (!email || !name || !lastname || !password) {
      res.status(400).end()
      return
    }

    const db = await openDB()
    res.once('finish', () => db.close())

    const existingUser = await db.get<User>('select * from Users where email = ?', [email])
    if (!!existingUser) {
      res.status(400).end()
      return
    }

    const { entityId, cst, accessToken } = await getCustomerToken({
      clientId: process.env.LC_CLIENT_ID!,
      redirectUri: process.env.LC_REDIRECT_URI!,
      serverAddress: process.env.LC_ACCOUNTS_URL!,
      licenseId: process.env.NEXT_PUBLIC_LC_LICENSE_ID!,
    })

    const id = uuid()
    const hashedPassword = await bcrypt.hash(password, 10)
    await db.run('insert into Users (id, email, name, lastname, password) values (?, ?, ?, ?, ?)', [
      id,
      email,
      name,
      lastname,
      hashedPassword,
    ])

    const user = await db.get<User>('select * from Users where id = ?', [id])
    if (!user) {
      throw new Error('User could not be created in DB')
    }

    await db.run('insert into LiveChatCustomers (id, cst, userId) values (?, ?, ?)', [entityId, cst, user.id])

    const customer = await db.get<LiveChatCustomer>('select * from LiveChatCustomers where id = ?', [entityId])
    if (!customer) {
      throw new Error('LiveChatCustomer could not be created in DB')
    }

    await fetch(
      `${process.env.LC_API_URL}/customer/action/update_customer?license_id=${process.env.NEXT_PUBLIC_LC_LICENSE_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email, name: `${name} ${lastname}` }),
      }
    )

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
    })
  } catch (error) {
    console.log(`\nError: POST /api/signup\n${error instanceof Error ? error.message : String(error)}\n`)
    res.status(500).end()
  }
}

export default signup
