import type { NextPage } from 'next';
import Layout from '@components/layout';
import Link from 'next/link';
import FloatingButton from '@components/floating-button';
import useSWR from 'swr';
import { Post, User } from '@prisma/client';
import useCoords from '@libs/client/useCoords';
import axios from 'axios';
import { useEffect } from 'react';
import client from '@libs/server/client';
import moment from 'moment';

interface PostWithUser extends Post {
    user: User;
    _count: {
        wonderings: number;
        answers: number;
    };
}

interface PostsResponse {
    // ok: boolean;
    posts: PostWithUser[];
}

const Community: NextPage<PostsResponse> = ({ posts }) => {
    // const { latitude, longitude } = useCoords();
    // const { data } = useSWR<PostsResponse>(
    //     latitude && longitude
    //         ? `/api/posts?latitude=${latitude}&longitude=${longitude}`
    //         : null
    // );
    return (
        <Layout seoTitle="Community" title="동네생활" hasTabBar>
            <div className="space-y-4 divide-y-[2px]">
                {posts?.map((post) => (
                    // {data?.posts?.map((post) => (
                    <Link key={post.id} href={`/community/${post.id}`}>
                        <a className="flex cursor-pointer flex-col pt-4 items-start">
                            <span className="flex ml-4 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                동네질문
                            </span>
                            <div className="mt-2 px-4 text-gray-700">
                                <span className="text-orange-500 font-medium">
                                    Q.
                                </span>{' '}
                                {post.question}
                            </div>
                            <div className="mt-5 px-4 flex items-center justify-between w-full text-gray-500 font-medium text-xs">
                                <span>{post.user.name}</span>
                                <span>
                                    {moment(post.createdAt).format(
                                        'YYYY-MM-DD HH:mm'
                                    )}
                                </span>
                            </div>
                            <div className="flex px-4 space-x-5 mt-3 text-gray-700 py-2.5 border-t   w-full">
                                <span className="flex space-x-2 items-center text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span>
                                        궁금해요 {post._count?.wonderings}
                                    </span>
                                </span>
                                <span className="flex space-x-2 items-center text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                        ></path>
                                    </svg>
                                    <span>답변 {post._count?.answers}</span>
                                </span>
                            </div>
                        </a>
                    </Link>
                ))}

                <FloatingButton href="/community/write">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                    </svg>
                </FloatingButton>
            </div>
        </Layout>
    );
};

/**
 * < ISR : Incremental Static Regeneration 단계적 정적 재생성 >
 * - 특정 주기마다 HTML을 새로고침하도록 설정함으로써, getStaticProps이 몇 번이든 재실행되어, 정적 페이지를 개별적으로 재생성할 수 있음.
 * - getServerSideProps를 사용하지 않고도 (서버단에서 페이지를 렌더링해주지 않아도) 페이지를 즉시 불러올 수 있으며, 페이지에 로딩 상태가 전혀 나타나지 않음.
 * - 유저가 페이지를 열면 이미 렌더링된 상태이며, 표시되는 데이터는 가장 최신 데이터.
 */
export async function getStaticProps() {
    console.log('BUILD COMM. STATICALLY');
    //getStaticProps는 빌드타임때만 DB에서 데이터를 불러오고 다시는 불러오지않음
    // npm run start를 하게되면 개발서버가 아니기 때문에 getStaticProps를 호출하지 않는 모습을 볼 수 있음.
    const posts = await client.post.findMany({ include: { user: true } });
    return {
        props: {
            posts: JSON.parse(JSON.stringify(posts)),
        },
        // 설정한 후 빌드를 하면 새로고침시 새로 빌드된 HTML을 받아 볼수 있음.
        // 설정된 20초가 지나면 페이지가 유효하지 않은걸로 판단함.
        // revalidate: 20,
        // OnDemend revalidate를 쓰게되면 여기서 설정을 안해줘도된다.
        // 대신 api핸들러에서 res.unstable_revalidate('/community') 호출

        // A ---> v1.0
        // B ---> v1.0
        // C ---> v1.0
        // D ---------> v1.0(v2.0)
        // E ---------> v2.0
    };
}

export default Community;
