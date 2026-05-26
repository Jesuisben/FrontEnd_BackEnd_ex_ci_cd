// 리액트에서 사용하는 상단 영역의 메뉴 정보를 저장해 놓은 파일
import { NavDropdown, Navbar, Container, Nav } from "react-bootstrap";

import { useNavigate } from "react-router-dom";

/*
- 부모에서 1개의 props를 자식에게 주면
자식은 2개의 행동을 해야 함
-> 1) 받은 프롭스의 type 작성 / 2) 매개변수에 해당 프롭스 추가 및 type 지정
*/

// 1) 받은 프롭스의 type 작성
// App.tsx에서 받은 프롭스를 해당 컴포넌트에서 다시 타입 정의
type MenuItemsProps = {
   appName: string;
};

// 2) 매개변수에 해당 프롭스 추가 및 type 지정
// 원래 프롭스에서 프롭을 꺼낼때는 {}을 사용함
// 매개변수에 넣어서 해당 함수 안에는 원래 변수처럼 {}없이 사용하게 하기
// 해당 매개변수의 타입이 해당 컴포넌트에서 정의한 타입을 이용해서 다시 정의 함
function App({ appName }: MenuItemsProps) {
   console.log('appName 프롭스 : ' + appName);
   const navigate = useNavigate();

   return (
      <Navbar bg="dark" variant="dark" expand="lg">
         <Container>
            {/* 매개변수로 받은 프롭 사용하기 */}
            <Navbar.Brand href='/'>{appName}</Navbar.Brand>
            <Nav className="me-auto">
               <NavDropdown title={`기본 연습`}>
                  <NavDropdown.Item onClick={() => navigate(`/fruit`)}>과일 1개</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate(`/fruit/list`)}>과일 목록</NavDropdown.Item>
               </NavDropdown>
               <Nav.Link onClick={() => navigate(`/member/signup`)}>회원 가입</Nav.Link>
            </Nav>
         </Container>
      </Navbar >
   );
}

export default App;