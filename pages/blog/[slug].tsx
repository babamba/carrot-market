import Layout from '@components/layout';
import { readdirSync } from 'fs';
import matter from 'gray-matter';
import { GetStaticProps, NextPage } from 'next';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
    return (
        <Layout canGoBack title={data.title} seoTitle={data.title}>
            <div
                className="blog-post-content"
                dangerouslySetInnerHTML={{ __html: post }}
            />
        </Layout>
    );
};

// 동적 URl을 갖는 페이지에서 getStaticProps를 사용할떄 필요함.
// 넘겨주는 paths 갯수에따라 getStaticProps를 통해 데이터를 전달하여 html을 생성
export function getStaticPaths() {
    const files = readdirSync('./posts').map((file) => {
        const [name, extension] = file.split('.');
        return { params: { slug: name } };
    });
    // return {
    //     paths: files,
    //     fallback: false,
    // };
    return {
        paths: [],
        fallback: 'blocking',
    };
    // 유저가 blocking fallback을 사용하는 페이지에 갔을 때,
    // 미리 만들어진 HTML이 없으면 유저는 아무것도 보지 못하고
    // 대신, getStaticProps가 서버사이드에서 작동하기 시작한다.
    // 페이지가 서버 사이드에서 렌더링되기 시작하고, 페이지가 준비가 되면
    // 그때 비로소 유저는 웹사이트를 볼수있음.
}

export const getStaticProps: GetStaticProps = async (ctx: any) => {
    const { data, content } = matter.read(`./posts/${ctx.params?.slug}.md`);
    const { value } = await unified()
        .use(remarkParse)
        .use(remarkHtml)
        .process(content);
    //console.log(value);
    return {
        props: {
            data,
            post: value,
        },
    };
};

export default Post;
