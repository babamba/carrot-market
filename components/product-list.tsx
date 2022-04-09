import { ProductWithCount } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
    kind: "favs" | "sales" | "purchases";
    isMe: boolean;
    id?: string | string[];
}

interface ProductListResponse {
    [key: string]: Record[];
}

interface Record {
    id: number;
    product: ProductWithCount;
}

export default function ProductList({ kind, isMe, id }: ProductListProps) {
    const { data } = useSWR<ProductListResponse>(
        isMe ? `/api/users/me/${kind}` : `/api/users/${id}/${kind}`
    );
    return data ? (
        <>
            {data[kind]?.map((record) => (
                <Item
                    id={record.product.id}
                    key={record.product.id}
                    title={record.product.name}
                    price={record.product.price}
                    hearts={record.product._count.favs}
                />
            ))}
        </>
    ) : null;
}
