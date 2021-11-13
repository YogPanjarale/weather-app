import type { NextApiRequest, NextApiResponse } from 'next'

function Handler(_req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ name: 'John Doe' })
}
export default Handler