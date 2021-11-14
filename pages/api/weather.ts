
import type { NextApiRequest, NextApiResponse } from 'next'

async function Handler(req: NextApiRequest, res: NextApiResponse) {
    if (!!req.query.city) {
		try {
			const res_ = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=${process.env.APPID}&units=metric`
			);
			const data = await res_.json();
			console.log(data);

			if (data.cod != 200) {

                return res.status(data.cod).json({
                    status: 'error',
                    error: data.message
                });
			}
            return res.status(200).json({
                status: 'success',
                data: data
            });

		} catch (err) {
			console.log(err);
            return res.status(500).json({
                status: 'error',
                error: 'Internal Server Error'
            });
			// return { props: { data: null ,error:`${err}`} };
		}
	}
    res.status(400).json({
        status: 'error',
        error: 'Bad Request'
    });
}
export default Handler