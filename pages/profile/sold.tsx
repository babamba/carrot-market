import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Sold: NextPage = () => {
    return (
        <Layout seoTitle="Sold" title="판매내역" canGoBack>
            <div className="flex flex-col space-y-5 pb-10  divide-y">
                <ProductList kind="sales" isMe={true} />
            </div>
        </Layout>
    );
};

export default Sold;
