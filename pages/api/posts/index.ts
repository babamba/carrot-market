import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';
import { withApiSession } from '@libs/server/withSession';

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseType>
) {
    if (req.method === 'POST') {
        const {
            body: { question, latitude, longitude },
            session: { user },
        } = req;

        const post = await client.post.create({
            data: {
                question,
                latitude,
                longitude,
                user: {
                    connect: {
                        id: user?.id,
                    },
                },
            },
        });

        // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration#on-demand-revalidation-beta
        // 사용자의 요청에 의해 의도적으로 화면에 대한 재생성(빌드)를 유발 시켜 캐시를 무효화하고 새로운 데이터로 그려진 정적요소를
        // 만들어 api를 요청하지 않았음에도 화면을 갱신할 수 있다.
        // await res.unstable_revalidate('/community');
        return res.json({
            ok: true,
            post,
        });
    }
    if (req.method === 'GET') {
        const {
            query: { latitude, longitude },
        } = req;

        const parsedLatitude = parseFloat(latitude.toString());
        const parsedLongitue = parseFloat(longitude.toString());

        const posts = await client.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                _count: {
                    select: {
                        wonderings: true,
                        answers: true,
                    },
                },
            },
            where: {
                latitude: {
                    gte: parsedLatitude - 0.01,
                    lte: parsedLatitude + 0.01,
                },
                longitude: {
                    gte: parsedLongitue - 0.01,
                    lte: parsedLongitue + 0.01,
                },
            },
        });
        return res.json({
            ok: true,
            posts,
        });
    }
}

export default withApiSession(
    withHandler({
        methods: ['GET', 'POST'],
        handler,
    })
);
