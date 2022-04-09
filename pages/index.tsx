import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { Product } from "@prisma/client";
import client from "@libs/server/client";
export interface ProductWithCount extends Product {
    _count: {
        favs: number;
    };
}
interface ProductsResponse {
    ok: boolean;
    products: ProductWithCount[];
}

// const Home: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
const Home: NextPage = () => {
    const { user, isLoading } = useUser();
    // 서버사이드로 데이터를 캐쉬에 주입받지만,
    // 클라이언트 사이드렌더링 시 제일 최신데이터를 가져온다.
    const { data } = useSWR<ProductsResponse>("/api/products");

    return (
        <Layout seoTitle="Home" title="홈" hasTabBar>
            <div className="flex flex-col space-y-5 divide-y">
                {data?.products.map((product) => (
                    <Item
                        id={product.id}
                        key={product.id}
                        title={product.name}
                        price={product.price}
                        hearts={product._count?.favs || 0}
                    />
                ))}
                <FloatingButton href="/products/upload">
                    <svg
                        className="h-6 w-6"
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </FloatingButton>
            </div>
        </Layout>
    );
};

// 서버사이드 데이터를 렌더링 전에 SWR의 초기 캐시 값으로 설정하기 위한 절차
const Page: NextPage<{ products: ProductWithCount[] }> = ({ products }) => {
    return (
        <SWRConfig
            value={{
                fallback: {
                    "/api/products": {
                        ok: true,
                        products,
                    },
                },
            }}
        >
            <Home />
        </SWRConfig>
    );
};

export async function getServerSideProps() {
    //console.log("SSR");
    // 서버사이드로 페이지를 구성하지만 해당 기능만으로는
    // SWR에서 제공하던 새로고침 기능은 제공할 수 없다.
    // static optimization 이나 cache 같은 걸 사용할 수 없게된다는 점
    const products = await client.product.findMany({});
    // getServerSideProps 의 문제점 - 서버사이드에서 네트워크가
    // 오래걸리면 걸릴수록 클라이언트가 기다려야하는(멈춰보이는 모습)을 볼수있음.
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return {
        props: {
            products: JSON.parse(JSON.stringify(products)),
        },
    };
}

export default Page;
