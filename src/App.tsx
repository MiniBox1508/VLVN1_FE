import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Leaderboard from "./Pages/Leaderboard";
import Lobbies from "./Pages/Lobbies";
import Players from "./Pages/Players";
// Bạn có thể import thêm các trang khác ở đây sau này
// import Lobbies from './Pages/Lobbies';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Mặc định khi vào trang web (/) sẽ tự động chuyển sang /leaderboard */}
        <Route path="/" element={<Navigate to="/leaderboard" replace />} />

        {/* 2. Đường dẫn chính thức cho trang Leaderboard */}
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* 3. Bạn có thể thêm các route khác tại đây */}
        <Route path="/lobbies" element={<Lobbies />} />

        <Route path="/players" element={<Players />} />
        {/* 4. Trang 404 nếu người dùng nhập bậy đường dẫn */}
        <Route path="*" element={<Navigate to="/leaderboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
