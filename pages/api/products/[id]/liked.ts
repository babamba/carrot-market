import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { withApiSession } from '@libs/server/withSession';

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query: { id },
        session: { user },
    } = req;

    const isLiked = Boolean(
        await client.fav.findFirst({
            where: {
                productId: +id.toString(),
                userId: user?.id,
            },
            select: {
                id: true,
            },
        })
    );

    res.json({ ok: true, isLiked });
}

export default withApiSession(
    withHandler({
        methods: ['GET'],
        handler,
    })
);
