import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";
import { useRouter } from "next/router";

const Loved: NextPage = () => {
    const {
        query: { id },
    } = useRouter();
    return (
        <Layout seoTitle="Loved" title="관심목록" canGoBack>
            <div className="flex flex-col space-y-5 pb-10  divide-y">
                <ProductList kind="favs" isMe={false} id={id} />
            </div>
        </Layout>
    );
};

export default Loved;
