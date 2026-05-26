import { Route, Routes } from "react-router-dom";

import FruitOne from './../pages/FruitOne';
import FruitList from './../pages/FruitList';

import HomePage from './../pages/HomePage';

import SignupPage from './../pages/SignupPage';
import LoginPage from './../pages/LoginPage';

import type { User } from "../types/User";

interface AppProps { // App.tsx에서 온 프롭스 - LoginPage.tsx에 전달만 함
  user: User | null; // 지금 당장은 user 프롭스가 필요하지 않음 - 다음 작업을 위해 미리 작성한듯
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
    </Routes>
  );
}

export default App;