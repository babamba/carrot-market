import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSession";

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === "POST") {
        const {
            session: { user },
            body: { name, price, description },
        } = req;

        const stream = await client.stream.create({
            data: {
                name,
                price: +price,
                description,
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
        });

        res.json({
            ok: true,
            stream,
        });
    }

    if (req.method === "GET") {
        const {
            query: { page },
        } = req;
        const take = 10;
        const backendPage = +page - 1;
        const streams = await client.stream.findMany({
            take,
            skip: backendPage * take,
        });

        res.json({
            ok: true,
            streams,
        });
    }
}

export default withApiSession(
    withHandler({
        methods: ["GET", "POST"],
        handler,
    })
);
