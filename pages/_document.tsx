import Document, { Head, Html, Main, NextScript } from 'next/document';

// _document 는 서버에서 한번만 실행됨.
// Nextjs 앱의 Html 뼈대를 짜주는 역할을 함.
class CustomDocument extends Document {
    render(): JSX.Element {
        //console.log("Document is Running");
        return (
            <Html lang="ko">
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default CustomDocument;
