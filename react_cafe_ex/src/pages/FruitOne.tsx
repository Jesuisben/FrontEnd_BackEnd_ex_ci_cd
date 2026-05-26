import axios from "axios"

import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";

import type { Fruit } from "../types/Fruit"

// axios 라이브러리를 이용하여 리액트에서 스프링으로 데이터를 요청해야 합니다.
function App() {
    // Fruit 타입으로 상태를 지정하세요.(Fruit.ts에서 지정한 타입)
    // 처음에는 값이 없으므로 null, 데이터가 들어 오면 Fruit 타입
    // const [state변수, state변경함수] = useState<타입>(초기값);
    const [fruit, setFruit] = useState<Fruit | null>(null); // 넘겨 받은 과일 1개

    // 컴포넌트가 화면에 나타날 때 특정 작업을 자동으로 실행하게 만드는 도구
    useEffect(() => { // BackEnd 서버에서 데이터 읽어 오기
        const fetchResult = async () => {
            try { // 백엔드에 요청하는 내용 작성
                // 요청할 url 주소 // config.tsx에서 변수 가져와야해서 import도 함
                const url = `${API_BASE_URL}/fruit`;

                // 쿠키 관련 내용인데 나중에 설명해줌
                const config = { withCredentials: true };

                // 스프링에서 /fruit가 RestController로 되어있어서 JSON파일로 받아짐
                // <Fruit>라는건 Fruit.ts와 똑같은 형식의 데이터를 해당 url에 가서 찾으라는 말
                // 스프링의 @GetMapping("/fruit")된 곳인 FruitController의 경우
                // bean이라는 Fruit클래스의 객체가 이에 해당함

                // axios의 get방식으로 메핑된 url에 가서 Fruit와 동일한 형식의 데이터의 값을 가져와서
                // response에 넣기
                const response = await axios.get<Fruit>(url, config);

                // fruit라는 State변수에 스프링에서 가져온 데이터인 response의 데이터를 넣음
                setFruit(response.data); // 응답 데이터를 fruit인 state변수에 넣음
            } catch (error) { // 예외처리할때 사용하는 구문 (오류처리)
                console.log(error);
            }
        };

        fetchResult(); // 직접 호출
    }, []);

    return (
        <>
            <Table hover style={{ margin: '20px' }}>
                <tbody>
                    <tr>
                        <td>아이디</td>

                        {/* optional chaining은 객체가 null 또는 undefined일 때 오류 없이 접근하도록 하는 자바 스크립트 문법입니다.*/}
                        {/* optional chaining : fruit가 null → 아무것도 안 나옴(undefined 반환), fruit가 존재 → id 출력 */}
                        <td>{fruit?.id}</td>
                    </tr>
                    <tr>
                        <td>상품명</td>
                        <td>{fruit?.name}</td>
                    </tr>
                    <tr>
                        <td>단가</td>
                        {/* toLocaleString은 사용자 지역의 숫자 단위에 맞게 ,등이 생김 */}
                        {/* 원래 10000원이라는 문장을 10,000원으로 바꿔줌 */}
                        <td>{fruit?.price.toLocaleString()}원</td>
                    </tr>
                </tbody>
            </Table >
        </>
    );
}

export default App;