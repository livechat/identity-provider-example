import { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { getCustomerToken } from 'lib/get-customer-token'
import { openDB } from 'database/open'
import { LiveChatCustomer } from 'database/types'

type ResponseBody =
  | {
      accessToken: string
      entityId: string
      expiresIn: number
      tokenType: string
      creationDate: number
      licenseId: number
    }
  | {
      error: string
    }

async function token(req: NextApiRequest, res: NextApiResponse<ResponseBody>) {
  if (req.method !== 'GET') {
    res.status(405).end()
    return
  }

  try {
    const { token } = cookie.parse(req.headers.cookie ?? '')
    if (!req.headers.cookie) {
      res.status(401).end()
      return
    }

    const { iss } = jwt.verify(token, process.env.SECRET!) as Record<string, string>

    const db = await openDB()
    res.once('finish', () => db.close())

    const customer = await db.get<LiveChatCustomer>('select * from LiveChatCustomers where userId = ?', [iss])
    if (!customer) {
      res.status(401).json({ error: 'Missing LiveChatCustomer entity for the current user' })
      return
    }

    const { accessToken, expiresIn, entityId } = await getCustomerToken({
      cst: customer.cst,
      entityId: customer.id,
      clientId: process.env.LC_CLIENT_ID!,
      redirectUri: process.env.LC_REDIRECT_URI!,
      serverAddress: process.env.LC_ACCOUNTS_URL!,
      licenseId: process.env.NEXT_PUBLIC_LC_LICENSE_ID!,
    })

    if (customer.id !== entityId) {
      res.status(401).json({ error: "LiveChatCustomer 'id' and LiveChat Accounts 'entityId' mismatch" })
      return
    }

    res.status(200).json({
      accessToken,
      entityId,
      expiresIn,
      tokenType: 'Bearer',
      creationDate: Date.now(),
      licenseId: Number(process.env.NEXT_PUBLIC_LC_LICENSE_ID!),
    })
  } catch {
    res.status(401).end()
  }
}

export default token
