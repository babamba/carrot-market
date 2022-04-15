import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import Script from "next/script";
import NextNProgress from 'nextjs-progressbar';

// _app 는 클라이언트에서 라우팅에 따른 page 컴포넌트를 렌더링 할떄마다 호출됨.
function MyApp({ Component, pageProps }: AppProps) {
    //console.log("App is Running");
    return (
        <SWRConfig
            value={{
                fetcher: (url: string) =>
                    fetch(url).then((response) => response.json()),
            }}
        >
            <div className="w-full max-w-xl mx-auto">
                <NextNProgress />
                <Component {...pageProps} />
            </div>
            {/* <Script
                src="https://developers.kakao.com/sdk/js/kakao.js"
                strategy="lazyOnload"
            /> */}
            {/* <Script
                src="https://connect.facebook.net/en_US/sdk.js"
                onLoad={() => {
                    console.log("onload script");
                }}
            /> */}
            {/* strategy 3종류
             * beforeInteractive - 페이지를 다 불러와서 상호작용 전 스크립트를 불러오는 전략
             * afterInteractive - 페이지를 먼저 다불러온 다음에 스크립트를 불러온다
             * lazyOnload - 다른 모든 데이터나 소스들을 불러오고 나서야 스크립트를 불러오는 전략
             */}
        </SWRConfig>
    );
}

export default MyApp;
