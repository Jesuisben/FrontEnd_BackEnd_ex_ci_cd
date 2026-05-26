import { useEffect, useState } from "react";
import type { Fruit } from "../types/Fruit";
import axios from "axios";
import { API_BASE_URL } from "../config/config";
import { Table } from "react-bootstrap";


function App() {
  const [fruitList, setFruitList] = useState<Fruit[]>([]); // 과일 여러개
  // FruitOne과 같이 Fruit.ts를 가져오지만 Fruit.ts의 양식으로 된 변수의 갯수가 여러개여서
  // Fruit[]인 배열로 만들어서 가져오기
  // | null을 넣으면 오히려 오류가 날 수 있어서 넣지 않음


  useEffect(() => {
    const fetchData = async () => {
      try {
        // 해당하는 주소 입력하기
        // 백틱 주의
        const url = `${API_BASE_URL}/fruit/list`;

        // 타입은 state와 동일하게 배열을 입력
        const response = await axios.get<Fruit[]>(url);
        setFruitList(response.data);

      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Table hover style={{ margin: '20px' }}>
        <thead>
          <tr>
            <th>아이디</th>
            <th>상품명</th>
            <th>단가</th>
          </tr>
        </thead>
        <tbody> {/* fruitList라는 state는 배열이여서 배열 안에 있는 요소를 꺼내기 위해 map함수 사용 */}
          {fruitList.map((fruit) => // map((매개변수명) => ) // map은 key가 필수 여러가지 요소중 특정하기 위해서
            <tr key={fruit.id}> {/* 데이터 베이스의 primary key같은 느낌 */}
              <td>{fruit.id}</td> {/* 그냥 적으면 문자열로 인식하니까 { }중괄호 사용해서 붙여넣기 */}
              <td>{fruit.name}</td>
              <td>{fruit.price.toLocaleString()}</td>
            </tr>
          )}
        </tbody>
      </Table >
    </>
  );
}

export default App;