import React from "react";
import { Trophy, Users, UserSearch, LayoutDashboard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm 2 hook này
import bgImage from "../assets/bg.jpg";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để kiểm tra URL hiện tại đang ở đâu

  // Định nghĩa menu với Path tương ứng
  const menuItems = [
    {
      id: "leaderboard",
      label: "Bảng xếp hạng",
      icon: <Trophy size={18} />,
      path: "/leaderboard",
    },
    {
      id: "lobbies",
      label: "Lobbies",
      icon: <Users size={18} />,
      path: "/lobbies",
    },
    {
      id: "players",
      label: "Players",
      icon: <UserSearch size={18} />,
      path: "/players",
    },
  ];

  return (
    <div
      className="relative min-h-screen w-full text-slate-200"
      style={{
        backgroundColor: "#020617",
        backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.15), rgba(2, 6, 23, 0.95)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* NAV BAR */}
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo - Click để về trang chủ */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/leaderboard")}
            >
              <div className="p-2 bg-cyan-500 rounded-xl transition-transform group-hover:scale-110">
                <LayoutDashboard className="text-slate-900" size={20} />
              </div>
              <span className="text-lg font-black italic uppercase tracking-tighter">
                VLVN1 <span className="text-cyan-400">TFT</span>
              </span>
            </div>

            {/* Menu điều hướng */}
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/5">
              {menuItems.map((item) => {
                // Kiểm tra xem item này có đang được active dựa trên URL không
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)} // Điều hướng URL
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
                      ${
                        isActive
                          ? "bg-cyan-500 text-slate-900 shadow-lg"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>

        <footer className="py-4 text-center text-slate-600 text-[10px] uppercase tracking-widest">
          © 2026 Vòng loại Việt Nam 1
        </footer>
      </div>
    </div>
  );
};

export default Layout;
