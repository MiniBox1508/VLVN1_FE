import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../Layouts/Layout";
import { Search, Users, ChevronLeft, ChevronRight, Hash } from "lucide-react";

const API_BASE_URL = "https://vlvn1-be.onrender.com";

// --- INTERFACES ---
interface LobbyMember {
  name: string;
}

interface Lobby {
  lobbyName: string;
  members: LobbyMember[];
}

interface Round {
  roundNumber: number;
  lobbies: Lobby[];
}

interface DayData {
  day: number;
  rounds: Round[];
}

const Lobbies: React.FC = () => {
  const [day, setDay] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Data State
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [selectedRound, setSelectedRound] = useState<number>(1);
  const [searchLobby, setSearchLobby] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- CALL API ---
  const fetchLobbies = useCallback(async () => {
    setLoading(true);
    try {
      // Đã sửa lại URL cho đúng với route của Backend: /api/lobbies/:day
      const response = await axios.get(`${API_BASE_URL}/api/lobbies/${day}`);
      if (response.data.success) {
        setDayData(response.data.data);
        // Reset về round đầu tiên có trong dữ liệu khi đổi ngày
        if (response.data.data.rounds.length > 0) {
          setSelectedRound(response.data.data.rounds[0].roundNumber);
        }
      }
    } catch (error) {
      console.error("Lỗi tải Lobbies:", error);
    } finally {
      setLoading(false);
    }
  }, [day]);

  useEffect(() => {
    fetchLobbies();
  }, [fetchLobbies]);

  // --- LOGIC XỬ LÝ DỮ LIỆU ---
  // 1. Lấy danh sách lobbies của Round đang chọn
  const currentRoundLobbies =
    dayData?.rounds.find((r) => r.roundNumber === selectedRound)?.lobbies || [];

  // 2. Lọc theo tên Lobby (Search)
  const filteredLobbies = currentRoundLobbies.filter((l) =>
    l.lobbyName.toLowerCase().includes(searchLobby.toLowerCase())
  );

  // 3. Phân trang (6 lobbies mỗi trang)
  const totalPages = Math.ceil(filteredLobbies.length / itemsPerPage);
  const paginatedLobbies = filteredLobbies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
        {/* --- HEADER & DAY SWITCH --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              Phòng Thi Đấu <span className="text-cyan-400">Lobbies</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Vòng loại Việt Nam 1 • Cập nhật trực tiếp
            </p>
          </div>

          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => {
                setDay(1);
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                day === 1
                  ? "bg-cyan-500 text-slate-950 shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Day 1
            </button>
            <button
              onClick={() => {
                setDay(2);
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                day === 2
                  ? "bg-cyan-500 text-slate-950 shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Day 2
            </button>
          </div>
        </div>

        {/* --- FILTERS (ROUND & SEARCH) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
          {/* Round Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <span className="text-slate-500 text-xs font-bold uppercase whitespace-nowrap mr-2">
              Vòng:
            </span>
            {dayData?.rounds.map((r) => (
              <button
                key={r.roundNumber}
                onClick={() => {
                  setSelectedRound(r.roundNumber);
                  setCurrentPage(1);
                }}
                className={`flex-shrink-0 w-10 h-10 rounded-xl font-bold transition-all border ${
                  selectedRound === r.roundNumber
                    ? "bg-cyan-500 border-cyan-400 text-slate-950 shadow-lg"
                    : "bg-slate-950/50 border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                {r.roundNumber}
              </button>
            ))}
          </div>

          {/* Lobby Search */}
          <div className="relative md:col-span-2">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm tên Lobby (Ví dụ: Lobby 1)..."
              value={searchLobby}
              onChange={(e) => {
                setSearchLobby(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* --- LOBBY GRID (6 LOBBIES PER PAGE) --- */}
        {loading ? (
          <div className="py-40 text-center">
            <div className="inline-block w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-bold tracking-widest animate-pulse uppercase text-xs">
              Đang tải danh sách phòng...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedLobbies.length > 0 ? (
              paginatedLobbies.map((lobby, idx) => (
                <div
                  key={idx}
                  className="group bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md hover:border-cyan-500/50 transition-all duration-300 shadow-2xl"
                >
                  {/* Lobby Header */}
                  <div className="bg-slate-800/80 px-5 py-3 border-b border-white/5 flex justify-between items-center group-hover:bg-cyan-500/10">
                    <div className="flex items-center gap-2">
                      <Hash size={16} className="text-cyan-400" />
                      <span className="font-black italic text-white uppercase tracking-tight">
                        {lobby.lobbyName}
                      </span>
                    </div>
                    <span className="bg-slate-950/50 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold uppercase">
                      Round {selectedRound}
                    </span>
                  </div>

                  {/* Lobby Members Table */}
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-1">
                      {lobby.members.map((member, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-white/5 hover:bg-slate-950 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-slate-600">
                              0{mIdx + 1}
                            </span>
                            <span className="text-sm font-bold text-slate-300 group-hover:text-white">
                              {member.name}
                            </span>
                          </div>
                          <Users size={12} className="text-slate-700" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-500 italic bg-slate-900/20 border border-dashed border-white/10 rounded-3xl">
                Không tìm thấy phòng thi đấu nào khớp với tiêu chí tìm kiếm.
              </div>
            )}
          </div>
        )}

        {/* --- PAGINATION --- */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 py-8">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 transition-all hover:bg-slate-800"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${
                    currentPage === i + 1
                      ? "bg-cyan-500 text-slate-950 shadow-lg"
                      : "bg-slate-900/50 text-slate-500 border border-white/5 hover:bg-slate-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-3 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 transition-all hover:bg-slate-800"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Lobbies;
