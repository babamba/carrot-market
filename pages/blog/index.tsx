import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
    title: string;
    date: string;
    category: string;
    slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
    return (
        <Layout title="Blog" seoTitle="Blog">
            <h1 className="font-semibold text-center text-xl mt-5 mb-10">
                Latest posts:
            </h1>
            {posts.map((post, idx) => (
                <div key={idx} className="mb-5  p-4">
                    <Link href={`/blog/${post.slug}`}>
                        <a>
                            <span className="text-lg text-red-500">
                                {post.title}
                            </span>
                            <div>
                                <span>
                                    {post.date} / {post.category}
                                </span>
                            </div>
                        </a>
                    </Link>
                </div>
            ))}
        </Layout>
    );
};

export async function getStaticProps() {
    // nodejs 파일시스템으로 정적요소에 대한 목록을 grey-matter 라이브러리로 md data json형태화
    // 목록을 props로 정적화면으로 빌드 결과물로 만들어준다 .
    const blogPosts = readdirSync("./posts").map((file) => {
        const content = readFileSync(`./posts/${file}`, "utf-8");
        const [slug, _] = file.split(".");
        return { ...matter(content).data, slug };
    });
    return {
        props: {
            posts: blogPosts.reverse(),
        },
    };
}

export default Blog;

/**
 * - getServerSideProps : 유저의 요청이 발생할 때마다 일어남
 * - getStaticProps     : 페이지가 빌드 되고, nextjs가 해당 페이지를 export 한후
 *                        일반 html로 될 때 딱 한번만 실행됨
 */
