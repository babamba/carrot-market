import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    const {
        query: { id },
    } = req;

    const purchases = await client.purchase.findMany({
        where: {
            userId: +id.toString(),
        },
        include: {
            product: {
                include: {
                    _count: {
                        select: {
                            favs: true,
                        },
                    },
                },
            },
        },
    });

    res.json({
        ok: true,
        purchases,
    });
}

export default withApiSession(
    withHandler({
        methods: ["GET"],
        handler,
    })
);
