console.log("hello im js bs"); // 자바스크립트를 로드 할 시점의 log

interface Props {
    text: string;
}
export default function Bs() {
    // 컴포넌트가 렌더된 후 log
    console.log(`hello im component bs`);
    // console.log(`hello im component bs ${props.text}`);
    return <h1>hello</h1>;
}
