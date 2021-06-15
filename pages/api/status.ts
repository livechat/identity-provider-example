import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  msg: string
}

export default (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  res.status(200).json({ msg: 'ok' })
}
