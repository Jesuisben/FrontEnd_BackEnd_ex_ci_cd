import { Route, Routes } from "react-router-dom";

import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';

import HomePage from './../pages/HomePage';

import SignupPage from './../pages/SignupPage';
import LoginPage from './../pages/LoginPage';
import ProductList from './../pages/ProductList';
import ProductInsertForm from './../pages/ProductInsertForm';

import type { User } from "../types/User";

interface AppProps { // App.tsx에서 온 프롭스 - LoginPage.tsx에 전달만 함
  user: User | null; // 로그인하면 App.tsx의 setUser로 의미있는 데이터가 되어 프롭스로 받아짐 (로그인안하면 null)
  handleLoginSuccess: (userData: User) => void;
}

function App({ user, handleLoginSuccess }: AppProps) {
  return (
    <Routes>
      <Route path="/fruit" element={<FruitOne />} />
      <Route path="/fruit/list" element={<FruitList />} />

      <Route path="/" element={<HomePage />} />

      <Route path='/member/signup' element={<SignupPage />} />
      <Route path='/member/login' element={<LoginPage onLogin={handleLoginSuccess} />} />
      <Route path='/product/list' element={<ProductList user={user} />} />
      <Route path='/product/insert' element={<ProductInsertForm user={user} />} />

    </Routes>
  );
}

export default App;