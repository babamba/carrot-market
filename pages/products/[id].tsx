import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Layout from '@components/layout';
import Button from '@components/button';
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import Link from 'next/link';
import { Product, User } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import { cls } from '@libs/client/utils';
import useUser from '@libs/client/useUser';
import client from '@libs/server/client';

interface ProductWithUser extends Product {
    user: User;
}

interface IsLikedByProduct {
    ok: boolean;
    isLiked: boolean;
}

interface ItemDetailResponse {
    ok: boolean;
    product: ProductWithUser;
    relatedProducts: Product[];
    isLiked: boolean;
}

//const ItemDetail: NextPage = () => {
const ItemDetail: NextPage<ItemDetailResponse> = ({
    product,
    relatedProducts,
    isLiked,
}) => {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const { mutate } = useSWRConfig();
    const { data: isLikedProduct, mutate: boundIsLikedMutate } =
    useSWR<IsLikedByProduct>(
        router.query.id ? `/api/products/${router.query.id}/liked` : null
    );
    const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
        router.query.id ? `/api/products/${router.query.id}` : null
    );
    const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
    const onFavClick = () => {
        if (!data) return;
        // boundMutate({ ...data, isLiked: !data.isLiked }, false);
//         boundMutate(
//             (prev) => prev && { ...prev, isLiked: !prev.isLiked },
//             false
//         );
        boundIsLikedMutate(
            (prev) => prev && { ...prev, isLiked: !prev.isLiked },
            false
        );
        toggleFav({});
        //mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    };

    const checkIsMe = () => {
        if (data?.product?.userId === user?.id) {
            return '/profile';
        } else {
            return `/profile/${data?.product?.user?.id}`;
        }
    };

    if (router.isFallback) {
        return (
            <Layout title="Loading for youuu">
                <span>I Love fallback</span>
            </Layout>
        );
    }

    return (
        <Layout canGoBack seoTitle="Product Detail">
            <div className="px-4  py-4">
                <div className="mb-8">
                    <div className="h-96 bg-slate-100" />
                    <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-slate-300" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {product?.user?.name}
                            </p>
                            <Link href={checkIsMe()}>
                                <a className="text-xs font-medium text-gray-500">
                                    View profile &rarr;
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-5">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {product?.name}
                        </h1>
                        <p className="text-3xl block mt-3 text-gray-900">
                            ${product?.price}
                        </p>
                        <p className="text-base my-6 text-gray-700">
                            {product?.description}
                        </p>
                        <div className="flex items-center justify-between space-x-2">
                            <Button large text="Talk to seller" />
                            <button
                                onClick={onFavClick}
                                className={cls(
                                    'p-3 rounded-md flex items-center justify-center',
                                    isLikedProduct?.isLiked
                                        ? 'text-red-500 hover:text-red-600'
                                        : 'text-gray-400 hover:text-gray-500'
                                )}
                            >
                                {isLikedProduct?.isLiked ? (
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-6 w-6 "
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Similar items
                    </h2>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        {relatedProducts?.map((product) => (
                            <Link
                                passHref={true}
                                key={product.id}
                                href={`/products/${product.id}`}
                            >
                                <div>
                                    <div className="h-56 w-full mb-4 bg-slate-300" />
                                    <h3 className="text-gray-700 -mb-1">
                                        {product.name}
                                    </h3>
                                    <span className="text-sm font-medium text-gray-900">
                                        ${product.price}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// paths: []을 보고 products/[id]에 대해
// 아무런 페이지도 미리 만들고 싶지 않는다는걸 알수 있음.
// 하지만 사용자가 이 페이지에 접근한다면, fallback이 개입.
// 만약 그 페이지에 해당하는 HTML파일이 없다면 fallback: blocking은
// 유저를 잠시동안 기다리게 만들고 fallback blocking이 그동안 백그라운드에서 페이지를 만들어
// 유저에게 넘긴다.
// 이 작업은 딱 한번 일어남. 기본적으로 서버사이드 렌더링.
// 첫번째 요청이후에 방문한 사람은 이미 HTML이 만들어져있으니 더이상 기다리지 않고 페이지를 바로 보게됨.
export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: [],

        /**
         * fallback이 false면
         * 준비된 HTML이 없을 경우 유저가 404응답을 받게됨
         * fallback이 false면 getStaticProps는 프로젝트 빌드 타임에 필요한 것들을 만들고
         * 어떠한 페이지든 프로젝트의 빌드과정에 만들어 지는 것만이 유저가 볼수있는 페이지임.
         */

        // fallback: false,

        /**
         * fallback이 'blocking'이면
         * 유저가 페이지가 최초로 만들어지는 동안 아무것도 볼수없음.
         */
        // fallback: 'blocking',

        /**
         * fallback이 true 이면
         * 유저가 사이트에 접속 했을 때 만약 미리 생성된 HTML이 존재하지 않으면
         * getStaticProps가 작동해 서버사이드 렌더링으로 HTML을 만들어냄.
         * fallback true는 유저에게 최소한의 뭐라도 보여줄 수 있게 해줌.
         */

        /**
         * fallback true/blocking 은 최초요청에 대해서 HTML을 만들어낼것임.
         */
        fallback: true,
    };
};

// 프로젝트를 빌드할때, NextJS는 이 함수를 보고
// '여기 getStaticProps가 있는걸 보니 이 html페이지를 미리 만들겠다는거구나? SSG'
export const getStaticProps: GetStaticProps = async (ctx) => {
    if (!ctx?.params?.id) {
        return {
            props: {},
        };
    }

    const product = await client.product.findUnique({
        where: {
            id: +ctx.params.id.toString(),
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                },
            },
        },
    });

    const terms = product?.name.split(' ').map((word) => ({
        name: {
            contains: word,
        },
    }));
    const relatedProducts = await client.product.findMany({
        where: {
            OR: terms,
            AND: {
                id: {
                    not: product?.id,
                },
            },
        },
    });

    const isLiked = false;
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // const isLiked = Boolean(
    //     await client.fav.findFirst({
    //         where: {
    //             productId: product?.id,
    //             userId: user?.id,
    //         },
    //         select: {
    //             id: true,
    //         },
    //     })
    // );

    return {
        props: {
            product: JSON.parse(JSON.stringify(product)),
            relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
            isLiked,
        },
    };
};

export default ItemDetail;
