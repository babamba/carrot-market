import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";
import { useRouter } from "next/router";

const Buy: NextPage = () => {
    const {
        query: { id },
    } = useRouter();
    return (
        <Layout seoTitle="Bought" title="구매내역" canGoBack>
            <div className="flex flex-col space-y-5 pb-10  divide-y">
                <ProductList kind="purchases" isMe={false} id={id} />
            </div>
        </Layout>
    );
};

export default Buy;
