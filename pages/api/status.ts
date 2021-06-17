import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  msg: string
}

function status(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.status(200).json({ msg: 'ok' })
}

export default status
