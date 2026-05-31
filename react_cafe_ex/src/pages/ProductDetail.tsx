/* 
상품 상세 보기
전체 화면을 좌우측을 1대2로 분리합니다.
왼쪽은 상품의 이미지 정보, 오른쪽은 상품의 정보 및 `장바구니`와 `주문하기` 버튼을 만듭니다.
*/

import customAxios from "./../api/axiosInstance";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config/config";
import type { Product } from "../types/Product";
import type { User } from "../types/User";

interface AppProps { // 사용자 권한을 나타내려고 쓰는 프롭스 (customAxios와 세트 느낌)
    user: User | null
}

function App({ user }: AppProps) {
    // useParams() : ProductList의 ${item.id}를 통해 받은 AppRoutes의 :id의 키와 값을 가진 객체
    const { id } = useParams(); // id 파라미터 챙기기
    const [product, setProduct] = useState<Product | null>(null); // 백엔드에서 넘어온 상품 정보넣을 state 객체

    // 로딩 상태를 의미하는 state로, 값이 true이면 현재 로딩 중입니다.
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // 파라미터 id가 갱신이 되면 화면을 다시 rendering 시킵니다.
    useEffect(() => {
        if (!user) { // 로그인하지 않아서 user의 데이터가 없을때
            alert('로그인이 필요한 서비스입니다.');
            navigate('/member/login');
            return;
        }

        const url = `${API_BASE_URL}/product/detail/${id}`;

        // 백엔드에서 id에 해당하는 데이터를 가져옴
        customAxios
            .get(url)
            .then((response) => {
                setProduct(response.data); // 백엔드에서 가져온 데이터를 Product state 객체에 넣음
                setLoading(false); // 상품 정보를 읽어 왔습니다. (false = 로딩이 완료됨)
            })
            .catch((error) => {
                console.log(error);

                if (error.response && error.response.status === 401) { // 401(UnAuthrized)
                    alert('로그인이 필요한 서비스입니다.');
                    navigate('/member/login'); // 로그인 페이지로 리다이렉트 

                } else {
                    alert('상품 정보를 불러 오는 중에 오류가 발생하였습니다.');
                    navigate(-1); // 이전 페이지로 이동하기
                }
            });
    }, [id, user, navigate]);

    // 아직 backend에서 읽어 오지 못한 경우를 대비한 코딩입니다.
    if (loading === true) { // true = 로딩중이라는 뜻
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 읽어 오는 중입니다.
                </h3>
            </Container>
        );
    }

    // 상품에 대한 정보가 없는 경우를 대비한 코딩입니다.
    if (!product) {
        return (
            <Container className="my-4 text-center">
                <h3>
                    상품 정보를 찾을 수 없습니다.
                </h3>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <Card>
                <Row className="g-0">
                    {/* 좌측 상품 이미지 */}
                    <Col md={4}>
                        <Card.Img
                            variant="top"
                            src={`${API_BASE_URL}/images/${product.image}`}
                            alt={`${product.name}`}
                            style={{ width: '100%', height: '400px' }}
                        />
                    </Col>
                    {/* 우측 상품 정보 및 구매 관련 버튼 */}
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="fd-3">
                                <h3>{product.name}</h3>
                            </Card.Title>
                            <Table striped>
                                <tbody>
                                    <tr>
                                        <td className="text-center">가격</td>
                                        <td>{product.price.toLocaleString()}원</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">카테고리</td>
                                        <td>{product.category}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">재고</td>
                                        <td>{product.stock.toLocaleString()}개</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">설명</td>
                                        <td>{product.description}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">등록일자</td>
                                        <td>{product.inputdate}</td>
                                    </tr>
                                </tbody>
                            </Table>


                            {/* 버튼(이전 목록) */}
                            <div className="d-flex justify-content-center mt-3">
                                <Button variant="primary" className="me-3 px-4" href="/product/list">
                                    이전 목록
                                </Button>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default App;