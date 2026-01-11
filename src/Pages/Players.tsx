import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Layout from "../Layouts/Layout";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  TrendingUp,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://vlvn1-be.onrender.com";

// Interface khớp với server.ts
interface Player {
  summonerName: string;
  rankPoints: number;
}

interface PaginationMeta {
  total: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

const Players: React.FC = () => {
  const [data, setData] = useState<Player[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // --- CALL API ---
  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      // Nếu có search term thì gọi endpoint /search, ngược lại gọi list thường
      const endpoint = searchTerm.trim()
        ? "/api/players/search"
        : "/api/players";

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        params: {
          page,
          limit: 10,
          name: searchTerm, // Backend nhận param 'name' để search summonerName
        },
      });

      if (response.data.success) {
        setData(response.data.data);
        setPagination(response.data.meta);
      }
    } catch (error) {
      console.error("Lỗi tải danh sách Players:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-700">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
              Danh sách <span className="text-cyan-400">Kỳ thủ</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
              Vòng loại Việt Nam 1 • Database
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm tên kỳ thủ..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyan-400 outline-none transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Tên Ingame</th>
                <th className="px-6 py-4 text-right">Rank Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="inline-block w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((player, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-500 font-mono text-sm">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg group-hover:bg-cyan-500/10 transition-colors">
                          <User
                            size={16}
                            className="text-slate-400 group-hover:text-cyan-400"
                          />
                        </div>
                        <span className="font-bold text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight">
                          {player.summonerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono text-cyan-400 font-black text-lg">
                          {player.rankPoints.toLocaleString()}
                        </span>
                        <TrendingUp size={14} className="text-slate-600" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="py-24 text-center text-slate-500 italic"
                  >
                    Không tìm thấy kỳ thủ nào...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-4">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
              Trang {page} / {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex gap-1.5">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                      page === i + 1
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-slate-900/50 text-slate-500 border border-white/5 hover:bg-slate-800"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-white disabled:opacity-20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Players;
