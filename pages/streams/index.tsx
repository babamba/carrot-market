import type { NextPage } from "next";
import Link from "next/link";
import FloatingButton from "@components/floating-button";
import Layout from "@components/layout";
import { Stream } from "@prisma/client";
import useSWR from "swr";
import { useEffect, useState } from "react";

interface StreamsResponse {
    ok: boolean;
    streams: Stream[];
}

const Streams: NextPage = () => {
    const [page, setPage] = useState(1);
    const [mergedData, setMergedData] = useState<Stream[]>([]);
    const { data } = useSWR<StreamsResponse>(`/api/streams?page=${page}`);

    const handleScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        if (data) setMergedData((prev) => prev.concat(data?.streams));
    }, [data]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [setPage, page]);

    return (
        <Layout seoTitle="Live" title="라이브" hasTabBar>
            <div className="py-10 divide-y-[1px] space-y-4">
                {mergedData?.map((stream) => (
                    <Link key={stream.id} href={`/streams/${stream.id}`}>
                        <a className="block px-4  pt-4">
                            <div className="aspect-video w-full rounded-md bg-slate-300 shadow-sm" />
                            <h1 className="mt-2 text-2xl font-bold text-gray-900">
                                {stream.name}
                            </h1>
                        </a>
                    </Link>
                ))}
                {/* {data?.streams.map((stream) => (
                    <Link key={stream.id} href={`/streams/${stream.id}`}>
                        <a className="pt-4 block  px-4">
                            <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
                            <h1 className="text-2xl mt-2 font-bold text-gray-900">
                                {stream.name}
                            </h1>
                        </a>
                    </Link>
                ))} */}
                <FloatingButton href="/streams/create">
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                </FloatingButton>
            </div>
        </Layout>
    );
};

export default Streams;
